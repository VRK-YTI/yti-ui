import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionNode, ConceptNode } from '../../entities/node';
import { stripMarkdown } from '../../utils/markdown';
import { LanguageService } from '../../services/language.service';
import { TermedService } from '../../services/termed.service';
import { ConceptViewModelService } from '../../services/concept.view.service';
import {
  Node as VisNode,
  Edge as VisEdge,
  DataSet,
  Network as VisNetwork,
  Options as VisNetworkOptions, IdType, EdgeOptions
} from 'vis';
import { ReferenceMeta } from '../../entities/meta';
import { Node } from '../../entities/node';
import { collectProperties } from '../../utils/array';
import { assertNever, requireDefined } from '../../utils/object';
import { TranslateService } from 'ng2-translate';
import { MetaModelService } from '../../services/meta-model.service';
import { asLocalizable } from '../../entities/localization';
import { Subscription } from 'rxjs';

interface ConceptNetworkData {
  nodes: DataSet<UpdatableVisNode>;
  edges: DataSet<UpdatableVisEdge>;
}

interface PointAndAngle {

  angle: number;
  point: {
    x: number;
    y: number;
  }
}

interface ArrowEndData extends PointAndAngle {

  core: {
    x: number;
    y: number;
  }

  length: number;
  type: string;
}

interface ArrowData {
  from: ArrowEndData;
  middle: ArrowEndData;
  to: ArrowEndData;
}

interface VisCanvasRenderingContext2D extends CanvasRenderingContext2D {

  circle(x: string|number, y: string|number, radius: string|number): void;
  square(x: string|number, y: string|number, radius: string|number): void;
  triangle(x: string|number, y: string|number, radius: string|number): void;
  triangleDown(x: string|number, y: string|number, radius: string|number): void;
  star(x: string|number, y: string|number, radius: string|number): void;
  diamond(x: string|number, y: string|number, radius: string|number): void;
  roundRect(x: string|number, y: string|number, width: string|number, height: string|number, radius: string|number): void;
  ellipse(x: string|number, y: string|number, width: string|number, height: string|number): void;
  database(x: string|number, y: string|number, width: string|number, height: string|number): void;
  arrowEndpoint(x: string|number, y: string|number, angle: string|number, length: string|number): void;
  circleEndpoint(x: string|number, y: string|number, angle: string|number, length: string|number): void;
  dashedLine(x: string|number, y: string|number, x2: string|number, y2: string|number, pattern: string): void;
}

// Distinguish between single click and double click
const DELAY = 600;

const options: VisNetworkOptions = {
  nodes: {
    shape: 'box',
    fixed: false,
    font: {
      color: '#000000',
      face: 'Open Sans'
    },
    color: {
      background: '#ffffff',
      border: '#000000',
      highlight: {
        background: '#d3d3d3',
        border: '#000000'
      },
      hover: {
        background: '#d3d3d3',
        border: '#000000'
      }
    }
  },
  groups: {
    rootConceptGroup: {
    },
    rootCollectionGroup: {
      margin: 20,
      borderWidth: 0,
    },
    relatedGroup: {
    },
    broaderGroup: {
    },
    isPartOfGroup: {
    },
    memberGroup: {
    }
  },
  layout: {
    hierarchical: {
      enabled: false,
      direction: 'DU',
      sortMethod: 'hubsize',
      parentCentralization: true,
      nodeSpacing: 250,
      levelSeparation: 100,
    },
    improvedLayout: true
  },
  edges: {
    smooth: {
      enabled: true,
      type: 'cubicBezier',
      roundness: 0.25
    },
    length: 250,
    hoverWidth: 3,
    color: {
      color: 'black'
    }
  },
  interaction: {
    hideEdgesOnDrag: false,
    hideNodesOnDrag: false,
    navigationButtons: true,
    hover: true,
    selectable: true,
    hoverConnectedEdges: true,
    selectConnectedEdges: false
  },
  physics: {
    enabled: true,
    solver: 'forceAtlas2Based', // hierarchicalRepulsion, repulsion, forceAtlas2Based, barnesHut
    forceAtlas2Based: {
      gravitationalConstant: -2000,
      centralGravity: 0.01,
      springConstant: 3,
      springLength: 100,
      damping: 1.5,
      avoidOverlap: 0
    },
    stabilization: {
      enabled: false,
      fit: true,
      iterations: 1
    },
    timestep: 0.4
  }
};

interface UpdatableVisNode extends VisNode {
  title: string;
  update: () => UpdatableVisNode;
}

type EdgeType = 'relation'
              | 'inheritance'
              | 'composition'

interface CustomizedVisEdge extends VisEdge {
  type: EdgeType;
}

interface UpdatableVisEdge extends CustomizedVisEdge {
  title: string;
  update: () => UpdatableVisEdge;
}

@Component({
  selector: 'app-concept-network',
  styleUrls: ['./concept-network.component.scss'],
  template: `
    <div class="component">

      <div class="component-header">
        <h3 translate>Visualization</h3>
      </div>

      <div class="canvas-container">
        <div #networkCanvas class="network-canvas" (mouseleave)="hidePopup()"></div>
        <canvas class="legend" #legendCanvas></canvas>
      </div>

    </div>
  `
})
export class ConceptNetworkComponent implements OnInit, OnDestroy {

  @ViewChild('networkCanvas') networkCanvasRef: ElementRef;
  @ViewChild('legendCanvas') legendCanvasRef: ElementRef;

  rootNode: Node<any>|null = null;

  private skipNextSelection = false;

  private clicks = 0;
  private timer: any;

  private network: VisNetwork;
  private networkData: ConceptNetworkData = {
    nodes: new DataSet<UpdatableVisNode>(),
    edges: new DataSet<UpdatableVisEdge>()
  };

  private languageSubscription: Subscription;
  private translateLanguageSubscription: Subscription;

  constructor(private zone: NgZone,
              private translateService: TranslateService,
              private languageService: LanguageService,
              private termedService: TermedService,
              private metaModelService: MetaModelService,
              private router: Router,
              private conceptViewModel: ConceptViewModelService) {

    const updateNetworkData = () => {

      const newNodes = this.networkData.nodes.map(node => node.update());
      this.networkData.nodes.update(newNodes);

      const newEdges = this.networkData.edges.map(edge => edge.update());
      this.networkData.edges.update(newEdges);
    };

    this.translateLanguageSubscription = this.languageService.translateLanguage$.subscribe(updateNetworkData);
  }

  public ngOnInit(): void {

    this.drawLegend();

    this.languageSubscription = this.languageService.language$.subscribe(() => {
      this.drawLegend();
    });

    this.zone.runOutsideAngular(() => {
      this.network = new VisNetwork(this.networkCanvasRef.nativeElement, this.networkData, options);
      this.network.on('dragStart', this.onDragStart.bind(this));
      this.network.on('click', this.onClick.bind(this));
    });

    this.conceptViewModel.action$.subscribe(action => {
      switch (action.type) {
        case 'select':
          if (!this.skipNextSelection) {
            this.resetRootNode(action.item);
            this.network.once('afterDrawing', () => this.network.fit());
          }
          this.skipNextSelection = false;
          break;
        case 'edit':
          this.updateNode(action.item);
          if (this.rootNode && this.rootNode.id === action.item.id) {
            this.rootNode = action.item;
          }
          break;
        case 'remove':
          if (this.rootNode && this.rootNode.id === action.item.id) {
            this.resetRootNode(null);
          } else {
            this.removeNode(action.item.id);
          }
          break;
        case 'noselect':
          if (this.rootNode && !this.rootNode.persistent) {
            this.resetRootNode(null);
          }
          break;
        default:
          assertNever(action, 'Unsupported action: ' + action);
      }
    });
  }

  public ngOnDestroy(): void {
    this.network.destroy();
    this.languageSubscription.unsubscribe();
    this.translateLanguageSubscription.unsubscribe();
  }

  isEmpty() {
    return this.networkData.nodes.length === 0;
  }

  private resetRootNode(node: ConceptNode|CollectionNode|null) {

    this.rootNode = node;
    this.networkData.nodes.clear();
    this.networkData.edges.clear();

    if (node) {
      this.createRootNode(node);
      this.updateEdgeNodes(node);
    }
  }

  private createConceptNodeData(concept: ConceptNode): UpdatableVisNode {

    const createNode = () => {
      const node = {
        id: concept.id,
        label: this.languageService.translate(concept.label),
        title: stripMarkdown(this.languageService.translate(asLocalizable(concept.definition, true))) // FIXME: how to handle multiple definitions?
      };

      return Object.assign(node, { update: createNode })
    };

    return createNode();
  }

  private createRootNode(node: ConceptNode|CollectionNode) {
    if (node.type === 'Concept') {
      this.networkData.nodes.add(this.createRootConceptNode(node));
    } else {
      this.networkData.nodes.add(this.createCollectionNode(node));
    }
  }

  private createRootConceptNode(concept: ConceptNode) {
    return Object.assign(this.createConceptNodeData(concept), {
      group: 'rootConceptGroup',
      physics: false,
      fixed: false
    });
  }

  private createCollectionNode(collection: CollectionNode) {

    const createNode = () => {
      const node = {
        id: collection.id,
        label: this.languageService.translate(collection.label),
        title: stripMarkdown(this.languageService.translate(asLocalizable(collection.definition, true))), // FIXME: how to handle multiple definitions?
        group: 'rootCollectionGroup',
        physics: false,
        fixed: false
      };

      return Object.assign(node, { update: createNode })
    };

    return createNode();
  }

  private createRelatedConceptNode(relatedConcept: ConceptNode) {
    return Object.assign(this.createConceptNodeData(relatedConcept), { group: 'relatedGroup' });
  }

  private createBroaderConceptNode(broaderConcept: ConceptNode) {
    return Object.assign(this.createConceptNodeData(broaderConcept), { group: 'broaderGroup' });
  }

  private createIsPartOfConceptNode(isPartOfConcept: ConceptNode) {
    return Object.assign(this.createConceptNodeData(isPartOfConcept), { group: 'isPartOfGroup' });
  }

  private createMemberConceptNode(memberConcept: ConceptNode) {
    return Object.assign(this.createConceptNodeData(memberConcept), { group: 'memberGroup' });
  }

  private createEdgeData(from: ConceptNode|CollectionNode, to: ConceptNode, meta: ReferenceMeta, type: EdgeType): UpdatableVisEdge {

    const createTitle = () => this.languageService.translate(meta.label, false) + ': ' +
      this.languageService.translate(from.label) +
      ' &rarr; ' +
      this.languageService.translate(to.label);

    const createEdge = () => {
      const edge = {
        from: from.id,
        to: to.id,
        id: from.id + to.id,
        title: createTitle(),
        type: type
      };

      return Object.assign(edge, { update: createEdge })
    };

    return createEdge();
  }

  private createRelatedConceptEdge(from: ConceptNode, to: ConceptNode, meta: ReferenceMeta) {
    return Object.assign(this.createEdgeData(from, to, meta, 'relation'), {
    });
  }

  private createBroaderConceptEdge(from: ConceptNode|CollectionNode, to: ConceptNode, meta: ReferenceMeta) {
    return Object.assign(this.createEdgeData(from, to, meta, 'inheritance'), {
      arrows: {
        to: true
      }
    });
  }

  private createIsPartOfConceptEdge(from: ConceptNode, to: ConceptNode, meta: ReferenceMeta) {
    return Object.assign(this.createEdgeData(from, to, meta, 'composition'), {
      arrows: {
        to: true
      }
    });
  }

  private createMemberConceptEdge(from: CollectionNode, to: ConceptNode, meta: ReferenceMeta) {
    return Object.assign(this.createEdgeData(from, to, meta, 'relation'), {
    });
  }

  private addNodeIfDoesNotExist(node: UpdatableVisNode) {
    if (!this.networkData.nodes.get(node.id)) {
      this.networkData.nodes.add(node);
    }
  }

  private addEdgeIfDoesNotExist(edge: UpdatableVisEdge) {
    if (!this.networkData.edges.get(edge.id)) {
      this.networkData.edges.add(edge);

      const edgeInstance = (this.network as any).edgesHandler.body.edges[requireDefined(edge.id)];

      edgeInstance.drawArrows = (ctx: VisCanvasRenderingContext2D, arrowData: ArrowData, o: EdgeOptions) =>
        ConceptNetworkComponent.drawEdgeArrows(ctx, edge.type, arrowData);
    }
  }

  private drawLegend() {

    const legendCanvas = this.legendCanvasRef.nativeElement;
    const ctx = legendCanvas.getContext('2d');

    const dpp = 4;
    const width = 247;
    const height = 55;

    legendCanvas.width = width * dpp;
    legendCanvas.height = height * dpp;

    legendCanvas.style.width = width + 'px';
    legendCanvas.style.height = height + 'px';

    ctx.clearRect(0, 0, legendCanvas.width, legendCanvas.height);
    ctx.scale(0.825 * dpp, 0.825 * dpp);

    this.translateService.get('Hierarchical').subscribe(text => {
      ConceptNetworkComponent.drawText(ctx, { x: 47.5, y: 50 }, text.toUpperCase());
    });

    this.translateService.get('Compositive').subscribe(text => {
      ConceptNetworkComponent.drawText(ctx, { x: 142.5, y: 50 }, text.toUpperCase());
    });

    this.translateService.get('Associative').subscribe(text => {
      ConceptNetworkComponent.drawText(ctx, { x: 247.5, y: 50 }, text.toUpperCase());
    });

    ConceptNetworkComponent.drawLine(ctx, { x: 20, y: 20 }, { x: 75, y: 20 });
    ConceptNetworkComponent.drawLine(ctx, { x: 115, y: 20 }, { x: 170, y: 20 });
    ConceptNetworkComponent.drawLine(ctx, { x: 220, y: 20 }, { x: 275, y: 20 });

    ConceptNetworkComponent.drawInheritanceArrow(ctx, {
      angle: 0,
      point: {
        x: 75,
        y: 20
      }
    });

    ConceptNetworkComponent.drawCompositionArrow(ctx, {
      angle: 0,
      point: {
        x: 170,
        y: 20
      }
    });
  }

  private static drawText(ctx: CanvasRenderingContext2D, to: { x: number, y: number }, text: string) {

    ctx.font = '600 12px Open Sans, Helvetica Neue, Helvetica, Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#000000';
    ctx.fillText(text , to.x, to.y);
  }

  private static drawLine(ctx: CanvasRenderingContext2D, from: { x: number, y: number }, to: { x: number, y: number }, lineWidth = 2) {

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = lineWidth;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.closePath();
    ctx.stroke();
  }

  private static drawInheritanceArrow(ctx: CanvasRenderingContext2D, data: PointAndAngle, lineWidth = 3) {

    const { angle, point } = data;
    const { x, y } = point;
    const length = 15;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = lineWidth;

    const top = { x: x - length * Math.cos(angle), y: y - length * Math.sin(angle) };
    const left = { x: top.x + length / 2 * Math.cos(angle + 0.5 * Math.PI), y: top.y + length / 2 * Math.sin(angle + 0.5 * Math.PI) };
    const right = { x: top.x + length / 2 * Math.cos(angle - 0.5 * Math.PI), y: top.y + length / 2 * Math.sin(angle - 0.5 * Math.PI) };

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(left.x, left.y);
    ctx.lineTo(right.x, right.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  private static drawCompositionArrow(ctx: CanvasRenderingContext2D, data: PointAndAngle, lineWidth = 3) {

    const { point, angle } = data;
    const { x, y } = point;
    const length = 15;

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = lineWidth;

    const top = { x: x - length * Math.cos(angle), y: y - length * Math.sin(angle) };
    const bottom = { x: x - length * 2 * Math.cos(angle), y: y - length * 2 * Math.sin(angle) };
    const left = { x: top.x + length / 2 * Math.cos(angle + 0.5 * Math.PI), y: top.y + length / 2 * Math.sin(angle + 0.5 * Math.PI) };
    const right = { x: top.x + length / 2 * Math.cos(angle - 0.5 * Math.PI), y: top.y + length / 2 * Math.sin(angle - 0.5 * Math.PI) };

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(left.x, left.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(right.x, right.y);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();
  }

  private static drawEdgeArrows(ctx: VisCanvasRenderingContext2D, edgeType: EdgeType, arrowData: ArrowData) {
    switch (edgeType) {
      case 'relation':
        // no arrow
        break;
      case 'inheritance':
        ConceptNetworkComponent.drawInheritanceArrow(ctx, arrowData.to);
        break;
      case 'composition':
        ConceptNetworkComponent.drawCompositionArrow(ctx, arrowData.to);
        break;
      default:
        assertNever(edgeType, 'Unsupported edge type: ' + edgeType);
    }
  }

  private updateNode(node: ConceptNode|CollectionNode) {

    if (node.type === 'Concept') {
      this.networkData.nodes.update(this.createConceptNodeData(node));
    } else {
      this.networkData.nodes.update(this.createCollectionNode(node));
    }

    this.updateEdgeNodes(node);
  }

  private updateEdgeNodes(node: ConceptNode|CollectionNode) {
    if (node.type === 'Concept') {
      this.updateEdgeNodesForConcept(node);
    } else {
      this.updateEdgeNodesForCollection(node);
    }
  }

  private updateEdgeNodesForConcept(concept: ConceptNode) {
    this.addEdgeNodesForConcept(concept);
    this.removeEdgeNodesFromConcept(concept);
  }

  private addEdgeNodesForConcept(concept: ConceptNode) {

    if (concept.hasRelatedConcepts()) {
      for (const relatedConcept of concept.relatedConcepts.values) {
        this.addNodeIfDoesNotExist(this.createRelatedConceptNode(relatedConcept));
        this.addEdgeIfDoesNotExist(this.createRelatedConceptEdge(concept, relatedConcept, concept.relatedConcepts.meta));
      }
    }

    if (concept.hasBroaderConcepts()) {
      for (const broaderConcept of concept.broaderConcepts.values) {
        this.addNodeIfDoesNotExist(this.createBroaderConceptNode(broaderConcept));
        this.addEdgeIfDoesNotExist(this.createBroaderConceptEdge(concept, broaderConcept, concept.broaderConcepts.meta));
      }
    }

    this.metaModelService.getReferrersByMeta<ConceptNode>(concept.narrowerConcepts).subscribe(referrers => {
      for (const {meta, nodes} of referrers) {
        for (const narrowerConcept of nodes) {
          this.addNodeIfDoesNotExist(this.createBroaderConceptNode(narrowerConcept));
          this.addEdgeIfDoesNotExist(this.createBroaderConceptEdge(narrowerConcept, concept, meta));
        }
      }
    });

    if (concept.hasIsPartOfConcepts()) {
      for (const isPartOfConcept of concept.isPartOfConcepts.values) {
        this.addNodeIfDoesNotExist(this.createIsPartOfConceptNode(isPartOfConcept));
        this.addEdgeIfDoesNotExist(this.createIsPartOfConceptEdge(concept, isPartOfConcept, concept.isPartOfConcepts.meta));
      }
    }

    this.metaModelService.getReferrersByMeta<ConceptNode>(concept.partOfThisConcepts).subscribe(referrers => {
      for (const {meta, nodes} of referrers) {
        for (const partOfThisConcept of nodes) {
          this.addNodeIfDoesNotExist(this.createIsPartOfConceptNode(partOfThisConcept));
          this.addEdgeIfDoesNotExist(this.createIsPartOfConceptEdge(partOfThisConcept, concept, meta));
        }
      }
    });
  }

  private removeEdgeNodesFromConcept(concept: ConceptNode) {
    this.removeEdgeNodesFromNode(concept.id, collectProperties([
      ...concept.hasRelatedConcepts() ? concept.relatedConcepts.values : [],
      ...concept.hasBroaderConcepts() ? concept.broaderConcepts.values : [],
      ...concept.narrowerConcepts.values,
      ...concept.hasIsPartOfConcepts() ? concept.isPartOfConcepts.values : [],
      ...concept.partOfThisConcepts.values
    ], c => c.id));
  }

  private updateEdgeNodesForCollection(collection: CollectionNode) {
    this.addEdgeNodesForCollection(collection);
    this.removeEdgeNodesFromCollection(collection);
  }

  private addEdgeNodesForCollection(collection: CollectionNode) {

    for (const memberConcept of collection.memberConcepts.values) {
      this.addNodeIfDoesNotExist(this.createMemberConceptNode(memberConcept));
      this.addEdgeIfDoesNotExist(this.createMemberConceptEdge(collection, memberConcept, collection.memberConcepts.meta));
    }

    if (collection.hasBroaderConcepts()) {
      for (const broaderConcept of collection.broaderConcepts.values) {
        this.addNodeIfDoesNotExist(this.createBroaderConceptNode(broaderConcept));
        this.addEdgeIfDoesNotExist(this.createBroaderConceptEdge(collection, broaderConcept, collection.broaderConcepts.meta));
      }
    }
  }

  private removeEdgeNodesFromCollection(collection: CollectionNode) {
    this.removeEdgeNodesFromNode(collection.id, collectProperties([
      ...collection.memberConcepts.values,
      ...collection.hasBroaderConcepts() ? collection.broaderConcepts.values : []
    ], concept => concept.id));
  }

  private removeNode(nodeId: string) {

    const edgesToRemove: IdType[] = [];

    for (const edge of this.networkData.edges.get(createConnectedEdgeFilter(nodeId))) {
      edgesToRemove.push(edge.id!);
    }

    this.networkData.edges.remove(edgesToRemove);
    this.networkData.nodes.remove(nodeId);
  }

  private removeEdgeNodesFromNode(nodeId: string, knownNeighbours: Set<IdType>) {

    const edgesToRemove: IdType[] = [];
    const nodesToRemove: IdType[] = [];

    for (const connectedEdge of this.networkData.edges.get(createConnectedEdgeFilter(nodeId))) {
      if (!knownNeighbours.has(connectedEdge.from!) && !knownNeighbours.has(connectedEdge.to!)) {
        edgesToRemove.push(connectedEdge.id!);
      }
    }

    this.networkData.edges.remove(edgesToRemove);

    for (const node of this.networkData.nodes.get()) {

      const isNotRootNode = this.rootNode && this.rootNode.id !== node.id;
      const isDisconnectedNode = this.networkData.edges.get(createConnectedEdgeFilter(node.id!)).length === 0;

      if (isNotRootNode && isDisconnectedNode) {
        nodesToRemove.push(node.id!);
      }
    }

    this.networkData.nodes.remove(nodesToRemove);
  }

  private onClick(eventData: any) {

    // If user starts dragging, reset click timer
    // NOTE: If user clicks the node and does not move cursor within 600ms, it will be interpreted as a click
    // leading to changing the concept

    const nodeId = eventData.nodes[0];
    const visNode: VisNode = this.networkData.nodes.get(nodeId);
    const isConcept = visNode.group !== 'rootCollectionGroup';

    const onSingleClick = () => {

      this.skipNextSelection = true;

      this.zone.run(() => {

        const graphId = requireDefined(this.conceptViewModel.vocabulary).graphId;

        if (isConcept) {
          this.router.navigate(['/concepts', graphId, 'concept', nodeId]);
        } else {
          this.router.navigate(['/concepts', graphId, 'collection', nodeId]);
        }
      });
    };

    const onDoubleClick = () => {
      if (isConcept) {
        const graphId = requireDefined(this.conceptViewModel.vocabulary).graphId;
        const rootConcept$ = this.termedService.getConcept(graphId, nodeId);
        rootConcept$.subscribe(concept => this.addEdgeNodesForConcept(concept));
      }
    };

    if (eventData.nodes.length > 0) {
      this.clicks++;
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          onSingleClick();
          this.clicks = 0;
        }, DELAY);
      } else {
        clearTimeout(this.timer);
        onDoubleClick();
        this.clicks = 0;
      }
    }
  };

  private onDragStart() {
    clearTimeout(this.timer);
    this.clicks = 0;
  };

  hidePopup(): void {
    const tooltip = this.networkCanvasRef.nativeElement.querySelector('.vis-tooltip');

    if (tooltip !== null) {
      tooltip.style.visibility = 'hidden';
    }
  }
}

function createConnectedEdgeFilter(id: IdType) {
  return {
    filter(edge: VisEdge) {
      return edge.from === id || edge.to === id;
    }
  }
}
