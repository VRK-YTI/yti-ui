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
  Options as VisNetworkOptions
} from 'vis';

interface ConceptNetworkData {
  nodes: DataSet<UpdatableVisNode>;
  edges: DataSet<UpdatableVisEdge>;
}

// Distinguish between single click and double click
const DELAY = 600;

const options: VisNetworkOptions = {
  nodes: {
    shape: 'box',
    fixed: false,
    font: {
      color: 'black',
      face: 'Open Sans'
    }
  },
  groups: {
    rootGroup: {
      font: {
        color: 'white',
      },
      color: {
        background: '#375e97',
        border: 'white',
        highlight: {
          background: 'black',
          border: 'white'
        },
        hover: {
          background: 'black',
          border: 'white'
        }
      }
    },
    relatedGroup: {
      color: {
        background: '#ebeff2',
        border: 'white',
        highlight: {
          background: 'white',
          border: 'black'
        },
        hover: {
          background: 'white',
          border: 'black'
        }
      }
    },
    broaderGroup: {
      color: {
        background: '#59a3ff',
        border: 'white',
        highlight: {
          background: 'white',
          border: 'black'
        },
        hover: {
          background: 'white',
          border: 'black'
        }
      }
    },
    isPartOfGroup: {
      color: {
        background: '#00ffcc',
        border: 'white',
        highlight: {
          background: 'white',
          border: 'black'
        },
        hover: {
          background: 'white',
          border: 'black'
        }
      }
    },
    collectionGroup: {
      margin: 20,
      font: {
        color: 'white',
      },
      color: {
        background: '#375e97',
        border: 'black',
        highlight: {
          background: 'black',
          border: 'white'
        },
        hover: {
          background: 'black',
          border: 'white'
        }
      }
    },
    memberGroup: {
      font: {
        color: 'white',
      },
      color: {
        background: '#375e97',
        border: 'white',
        highlight: {
          background: 'black',
          border: 'white'
        },
        hover: {
          background: 'black',
          border: 'white'
        }
      }
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
      type: 'cubicBezier', // 'continuous', 'discrete', 'diagonalCross', 'straightCross', 'horizontal', 'vertical', 'curvedCW', 'curvedCCW', 'cubicBezier'
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
  update: () => VisNode;
}

interface UpdatableVisEdge extends VisEdge {
  title: string;
  update: () => VisEdge;
}

@Component({
  selector: 'concept-network',
  styleUrls: ['./concept-network.component.scss'],
  template: `
    <div class="component">

      <div class="component-header">
        <h3 translate>Visualization</h3>
      </div>

      <div #canvas class="network-canvas" (mouseleave)="hidePopup()"></div>

    </div>
  `
})
export class ConceptNetworkComponent implements OnInit, OnDestroy {

  @ViewChild('canvas') canvasRef: ElementRef;

  persistentSelection: boolean;

  private skipNextSelection = false;

  private clicks = 0;
  private timer: any;

  private network: VisNetwork;
  private networkData: ConceptNetworkData = {
    nodes: new DataSet<UpdatableVisNode>(),
    edges: new DataSet<UpdatableVisEdge>()
  };

  constructor(private zone: NgZone,
              private languageService: LanguageService,
              private termedService: TermedService,
              private router: Router,
              private conceptViewModel: ConceptViewModelService) {

    const updateNetworkData = () => {

      const newNodes = this.networkData.nodes.map(node => node.update());
      this.networkData.nodes.update(newNodes);

      const newEdges = this.networkData.edges.map(edge => edge.update());
      this.networkData.edges.update(newEdges);
    };

    this.languageService.languageChange$.subscribe(updateNetworkData);
  }

  public ngOnInit(): void {

    this.zone.runOutsideAngular(() => {
      this.network = new VisNetwork(this.canvasRef.nativeElement, this.networkData, options);
      this.network.on('dragStart', this.onDragStart.bind(this));
      this.network.on('click', this.onClick.bind(this));
    });

    this.conceptViewModel.selection$.subscribe(selection => {

      if (selection && !this.skipNextSelection) {
        this.persistentSelection = selection.persistent;
        this.networkData.nodes.clear();
        this.networkData.edges.clear();

        if (selection.type === 'Concept') {
          this.networkData.nodes.add(this.createRootConceptNode(selection));
          this.addEdgeNodesForConcept(selection);
        } else {
          this.networkData.nodes.add(this.createCollectionNode(selection));
          this.addEdgeNodesForCollection(selection);
        }

        this.network.once('afterDrawing', () => this.network.fit());
      }

      this.skipNextSelection = false;
    });
  }

  public ngOnDestroy(): void {
    this.network.destroy();
  }

  isEmpty() {
    return this.networkData.nodes.length === 0;
  }

  private createConceptNodeData(concept: ConceptNode): UpdatableVisNode {

    const createNode = () => {
      const node = {
        id: concept.id,
        label: this.languageService.translate(concept.label),
        title: stripMarkdown(this.languageService.translate(concept.definition))
      };

      return Object.assign(node, { update: createNode })
    };

    return createNode();
  }

  private createRootConceptNode(concept: ConceptNode) {
    return Object.assign(this.createConceptNodeData(concept), {
      group: 'rootGroup',
      physics: false,
      fixed: false
    });
  }

  private createCollectionNode(collection: CollectionNode) {

    const createNode = () => {
      const node = {
        id: collection.id,
        label: this.languageService.translate(collection.label),
        title: stripMarkdown(this.languageService.translate(collection.definition)),
        group: 'collectionGroup',
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

  private createEdgeData(from: ConceptNode|CollectionNode, to: ConceptNode): UpdatableVisEdge {

    const createEdge = () => {
      const edge = {
        from: from.id,
        to: to.id,
        id: from.id + to.id,
        title: this.languageService.translate(from.label) + ' - ' + this.languageService.translate(to.label)
      };

      return Object.assign(edge, { update: createEdge })
    };

    return createEdge();
  }

  private createRelatedConceptEdge(from: ConceptNode, to: ConceptNode) {
    return Object.assign(this.createEdgeData(from, to), {
      arrows: {
        to: {
          enabled: true,
          scaleFactor: 0.7,
          type: 'arrow'
        }
      }
    });
  }

  private createBroaderConceptEdge(from: ConceptNode, to: ConceptNode) {
    return Object.assign(this.createEdgeData(from, to), {
    });
  }

  private createIsPartOfConceptEdge(from: ConceptNode, to: ConceptNode) {
    return Object.assign(this.createEdgeData(from, to), {
      dashes: true
    });
  }

  private createMemberConceptEdge(from: CollectionNode, to: ConceptNode) {
    return Object.assign(this.createEdgeData(from, to), {
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
    }
  }

  private addEdgeNodesForConcept(concept: ConceptNode) {

    for (const relatedConcept of concept.relatedConcepts) {
      this.addNodeIfDoesNotExist(this.createRelatedConceptNode(relatedConcept));
      this.addEdgeIfDoesNotExist(this.createRelatedConceptEdge(concept, relatedConcept));
    }

    for (const narrowerConcept of concept.narrowerConcepts) {
      this.addNodeIfDoesNotExist(this.createBroaderConceptNode(narrowerConcept));
      this.addEdgeIfDoesNotExist(this.createBroaderConceptEdge(concept, narrowerConcept));
    }

    for (const isPartOfConcept of concept.partOfThisConcepts) {
      this.addNodeIfDoesNotExist(this.createIsPartOfConceptNode(isPartOfConcept));
      this.addEdgeIfDoesNotExist(this.createIsPartOfConceptEdge(concept, isPartOfConcept));
    }
  }

  private addEdgeNodesForCollection(collection: CollectionNode) {

    for (const memberConcept of collection.members) {
      this.addNodeIfDoesNotExist(this.createMemberConceptNode(memberConcept));
      this.addEdgeIfDoesNotExist(this.createMemberConceptEdge(collection, memberConcept));
    }
  }

  private onClick(eventData: any) {

    // If user starts dragging, reset click timer
    // NOTE: If user clicks the node and does not move cursor within 600ms, it will be interpreted as a click
    // leading to changing the concept

    const conceptId = eventData.nodes[0];
    const visNode: VisNode = this.networkData.nodes.get(conceptId);
    const isConcept = visNode.group !== 'collectionGroup';

    const onSingleClick = () => {
      if (isConcept) {
        this.skipNextSelection = true;

        this.zone.run(() => {
          this.router.navigate(['/concepts', this.conceptViewModel.vocabulary.graphId, 'concept', conceptId]);
        });
      }
    };

    const onDoubleClick = () => {
      if (isConcept) {
        const rootConcept$ = this.termedService.getConcept(this.conceptViewModel.vocabulary.graphId, conceptId, this.conceptViewModel.languages);
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

  private hidePopup(): void {
    const tooltip = this.canvasRef.nativeElement.querySelector('.vis-tooltip');

    if (tooltip !== null) {
      tooltip.style.visibility = 'hidden';
    }
  }
}
