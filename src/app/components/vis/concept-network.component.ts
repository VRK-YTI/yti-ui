import { Component, OnInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { Node } from '../../entities/node';
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
  nodes: DataSet<VisNode>;
  edges: DataSet<VisEdge>;
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

  persistentRoot: boolean;

  private skipNextConcept = false;

  private clicks = 0;
  private timer: any;

  private network: VisNetwork;
  private networkData: ConceptNetworkData = {
    nodes: new DataSet<VisNode>(),
    edges: new DataSet<VisEdge>()
  };

  constructor(private zone: NgZone,
              private languageService: LanguageService,
              private termedService: TermedService,
              private router: Router,
              private conceptViewModel: ConceptViewModelService) {
  }

  public ngOnInit(): void {

    this.zone.runOutsideAngular(() => {
      this.network = new VisNetwork(this.canvasRef.nativeElement, this.networkData, options);
      this.network.on('dragStart', this.onDragStart.bind(this));
      this.network.on('click', this.onClick.bind(this));
    });

    this.conceptViewModel.concept$.subscribe(rootConcept => {

      if (rootConcept && !this.skipNextConcept) {
        // this.persistentRoot = rootConcept.persistent;
        this.networkData.nodes.clear();
        this.networkData.edges.clear();
        this.networkData.nodes.add(this.createRootNode(rootConcept));

        this.addEdgeNodesForConcept(rootConcept);
        this.network.once('afterDrawing', () => this.network.fit());
      }

      this.skipNextConcept = false;
    });
  }

  public ngOnDestroy(): void {
    this.network.destroy();
  }

  isEmpty() {
    return this.networkData.nodes.length === 0;
  }

  private createNodeData(concept: Node<'Concept'>) {
    return {
      id: concept.id,
      label: this.languageService.translate(concept.label),
      title: stripMarkdown(this.languageService.translate(concept.definition))
    };
  }

  private createRootNode(concept: Node<'Concept'>) {
    return Object.assign(this.createNodeData(concept), {
      group: 'rootGroup',
      physics: false,
      fixed: false
    });
  }

  private createRelatedConceptNode(relatedConcept: Node<'Concept'>) {
    return Object.assign(this.createNodeData(relatedConcept), { group: 'relatedGroup' });
  }

  private createBroaderConceptNode(broaderConcept: Node<'Concept'>) {
    return Object.assign(this.createNodeData(broaderConcept), { group: 'broaderGroup' });
  }

  private createIsPartOfConceptNode(isPartOfConcept: Node<'Concept'>) {
    return Object.assign(this.createNodeData(isPartOfConcept), { group: 'isPartOfGroup' });
  }

  private createEdgeData(from: Node<'Concept'>, to: Node<'Concept'>) {
    return {
      from: from.id,
      to: to.id,
      id: from.id + to.id,
      title: this.languageService.translate(from.label) + ' - ' + this.languageService.translate(to.label)
    }
  }

  private createRelatedConceptEdge(from: Node<'Concept'>, to: Node<'Concept'>) {
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

  private createBroaderConceptEdge(from: Node<'Concept'>, to: Node<'Concept'>) {
    return Object.assign(this.createEdgeData(from, to), {
    });
  }

  private createIsPartOfConceptEdge(from: Node<'Concept'>, to: Node<'Concept'>) {
    return Object.assign(this.createEdgeData(from, to), {
      dashes: true
    });
  }

  private addEdgeNodesForConcept(rootConcept: Node<'Concept'>) {

    const addNodeIfDoesNotExist = (node: VisNode) => {
      if (!this.networkData.nodes.get(node.id)) {
        this.networkData.nodes.add(node);
      }
    };

    const addEdgeIfDoesNotExist = (edge: VisEdge) => {
      if (!this.networkData.edges.get(edge.id)) {
        this.networkData.edges.add(edge);
      }
    };

    for (const relatedConcept of rootConcept.references['related'].values || []) {
      addNodeIfDoesNotExist(this.createRelatedConceptNode(relatedConcept));
      addEdgeIfDoesNotExist(this.createRelatedConceptEdge(rootConcept, relatedConcept));
    }

    for (const broaderConcept of rootConcept.referrers['broader'] || []) {
      addNodeIfDoesNotExist(this.createBroaderConceptNode(broaderConcept));
      addEdgeIfDoesNotExist(this.createBroaderConceptEdge(rootConcept, broaderConcept));
    }

    for (const isPartOfConcept of rootConcept.referrers['isPartOf'] || []) {
      addNodeIfDoesNotExist(this.createIsPartOfConceptNode(isPartOfConcept));
      addEdgeIfDoesNotExist(this.createIsPartOfConceptEdge(rootConcept, isPartOfConcept));
    }
  }

  private onClick(eventData: any) {

    // If user starts dragging, reset click timer
    // NOTE: If user clicks the node and does not move cursor within 600ms, it will be interpreted as a click
    // leading to changing the concept

    if (eventData.nodes.length > 0) {
      this.clicks++;
      if (this.clicks === 1) {
        this.timer = setTimeout(() => {
          const conceptId = eventData.nodes[0];
          this.skipNextConcept = true;

          this.zone.run(() => {
            this.router.navigate(['/concepts', this.conceptViewModel.conceptScheme.graphId, 'concept', conceptId]);
          });

          this.clicks = 0;
        }, DELAY);
      } else {
        clearTimeout(this.timer);
        const rootId = eventData.nodes[0];
        // Fetch data for the double-clicked node and then add the edge nodes for it
        const rootConcept$ = this.termedService.getConcept(this.conceptViewModel.conceptScheme.graphId, rootId, this.conceptViewModel.languages);
        rootConcept$.subscribe(concept => this.addEdgeNodesForConcept(concept));
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
