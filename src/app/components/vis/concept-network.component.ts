import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Node} from '../../entities/node';
import { stripMarkdown } from '../../utils/markdown';
import { Router } from '@angular/router';

import {
  VisNodes,
  VisEdges,
  VisNetworkService,
  VisNetworkData,
  VisNetworkOptions } from 'ng2-vis';
import {LanguageService} from "../../services/language.service";
import {TermedService} from "../../services/termed.service";
import {ConceptSplitPanelComponent} from "../concept-split-panel.component";
import {ConceptsComponent} from "../concepts.component";

class ConceptNetworkData implements VisNetworkData {
  public nodes: VisNodes;
  public edges: VisEdges;
}

@Component({
  selector: 'concept-network',
  styleUrls: ['./concept-network.component.scss'],
  template: `
    <h2>Concept Network</h2>
    <div class="network-canvas" [visNetwork]="conceptNetwork" [visNetworkData]="conceptNetworkData" [visNetworkOptions]="conceptNetworkOptions" (initialized)="networkInitialized()"></div>
  `
})
export class ConceptNetworkComponent implements OnInit, OnDestroy {

  public conceptNetwork: string = 'conceptNetwork';
  public conceptNetworkData: ConceptNetworkData;
  public conceptNetworkOptions: VisNetworkOptions;

  private rootConceptId: string;

  public constructor(private visNetworkService: VisNetworkService,
                     private languageService: LanguageService,
                     private termedService: TermedService,
                     private router: Router,
                     private conceptsComponent: ConceptsComponent,
                     private conceptSplitPanelComponent: ConceptSplitPanelComponent) { }


  public networkInitialized(): void {
    this.visNetworkService.on(this.conceptNetwork, 'stabilizationIterationsDone');
    this.visNetworkService.on(this.conceptNetwork, 'click');

    this.visNetworkService.stabilizationIterationsDone.subscribe((eventData: any) => {
      if (eventData === this.conceptNetwork) {
        // Do something after network has stabilized
      }
    });

    // Distinguish between single click and double click
    var DELAY: number = 600, clicks: number = 0, timer: any;
    this.visNetworkService.click
        .subscribe((eventData: any[]) => {
          if (eventData[0] === this.conceptNetwork && eventData[1] && eventData[1].nodes.length > 0) {
            clicks++;
            if (clicks === 1) {
              timer = setTimeout(() => {
                let conceptId = eventData[1].nodes[0];
                this.router.navigate(['/concepts', this.conceptsComponent.graphId, 'rootConcept', this.rootConceptId, 'concept', conceptId])
                clicks = 0;
              }, DELAY);
            } else {
              clearTimeout(timer);
              let rootId = eventData[1].nodes[0];
              // Fetch data for the double-clicked node and then add the edge nodes for it
              let rootConcept$ = this.termedService.getConcept(this.conceptsComponent.graphId, rootId);
              rootConcept$.subscribe(concept => {
                this.addEdgeNodesForConcept(concept);
              });
              clicks = 0;
            }
          }
        });
  }

  /*
  Initialize network with root node, set network options and finally add edge nodes
   */
  public ngOnInit(): void {
    this.conceptSplitPanelComponent.rootConcept$.subscribe(rootConcept => {
      if (rootConcept) {
        this.rootConceptId = rootConcept.id;
        let rootVisNode = {
          id: this.rootConceptId,
          label: this.languageService.translate(rootConcept.label),
          title: stripMarkdown(this.languageService.translate(rootConcept.definition)),
          group: 'rootGroup',
          color: 'blue'
        };

        this.conceptNetworkData = {
          nodes: new VisNodes([rootVisNode]),
          edges: new VisEdges()
        }

        this.conceptNetworkOptions = {
          nodes: {
            shape: 'ellipse',
            fixed: true
          },
          groups: {
            rootGroup: {font: {color: 'black'}},
            relatedGroup: {font: {color: 'black'}},
            broaderGroup: {font: {color: 'black'}},
            isPartOfGroup: {font: {color: 'black'}}
          },
          layout: {
            hierarchical: {
              enabled: true,
              direction: 'UD',
              sortMethod: 'directed',
              parentCentralization: false,
              nodeSpacing: 200,
              // blockShifting: false,
              // edgeMinimization: false
            },
            improvedLayout: true
          },
          edges: {
            smooth: {
              enabled: true,
              type: 'cubicBezier', // 'continuous', 'discrete', 'diagonalCross', 'straightCross', 'horizontal', 'vertical', 'curvedCW', 'curvedCCW', 'cubicBezier'
              roundness: 0.5
            },
            length: 250,
            hoverWidth: 3,
            color: {
              color: 'black',
              highlight: 'blue',
              hover: 'blue'
            }
          },
          interaction: {
            hideEdgesOnDrag: false,
            hideNodesOnDrag: false,
            navigationButtons: false,
            hover: true,
            selectable: true,
            hoverConnectedEdges: true,
            selectConnectedEdges: false,
          },
          physics: {
            enabled: true,
            barnesHut: {
              avoidOverlap: 1
            },
            hierarchicalRepulsion: {},
            solver: 'hierarchicalRepulsion' // try forceAtlas2Based
          }
        };

        this.addEdgeNodesForConcept(rootConcept);
      }
    });
  }

  private addEdgeNodesForConcept(rootConceptNode: Node<'Concept'>) {
    if(rootConceptNode) {
      let rootConceptNodeId = rootConceptNode.id;
      let relatedConcepts: Node<'Concept'>[] = rootConceptNode.references['related']['values'];
      let broaderConcepts: Node<'Concept'>[] = rootConceptNode.referrers['broader'];
      let isPartOfConcepts: Node<'Concept'>[] = rootConceptNode.referrers['isPartOf'];

      if(relatedConcepts) {
        relatedConcepts.forEach(relConcept => {
          let relNode = {
            id: relConcept.id,
            label: this.languageService.translate(relConcept.label),
            title: stripMarkdown(this.languageService.translate(relConcept.definition)),
            group: 'relatedGroup',
            color: {
              background: '#4ce9ff',
              highlight: {
                background: 'white',
                border: 'black'
              },
              hover: {
                background: 'white',
                border: 'black'
              }
            },
            shadow: true
          };

          if(!this.conceptNetworkData.nodes.getById(relNode.id)) {
            this.conceptNetworkData.nodes.add(relNode);
          }

          let relEdge = {
            from: rootConceptNodeId,
            to: relNode.id,
            arrows: {
              to: {
                enabled: true,
                scaleFactor: 0.7,
                type: 'arrow'
              }
            },
            id: rootConceptNodeId + relNode.id
          };
          this.conceptNetworkData.edges.add(relEdge);
        });
      }

      if(broaderConcepts) {
        broaderConcepts.forEach(broaderConcept => {
          let broaderNode = {
            id: broaderConcept.id,
            label: this.languageService.translate(broaderConcept.label),
            title: stripMarkdown(this.languageService.translate(broaderConcept.definition)),
            group: 'broaderGroup',
            color: {
              background: '#59a3ff',
              highlight: {
                background: 'white',
                border: 'black'
              },
              hover: {
                background: 'white',
                border: 'black'
              }
            }
          };

          if(!this.conceptNetworkData.nodes.getById(broaderConcept.id)) {
            this.conceptNetworkData.nodes.add(broaderNode);
          }

          let broaderEdge = {
            from: rootConceptNodeId,
            to: broaderNode.id,
            id: rootConceptNodeId + broaderNode.id
          };
          this.conceptNetworkData.edges.add(broaderEdge);
        });
      }

      if(isPartOfConcepts) {
        isPartOfConcepts.forEach(isPartOfConcept => {
          let isPartOfNode = {
            id: isPartOfConcept.id,
            label: this.languageService.translate(isPartOfConcept.label),
            title: stripMarkdown(this.languageService.translate(isPartOfConcept.definition)),
            group: 'isPartOfGroup',
            color: {
              background: '#00ffcc',
              highlight: {
                background: 'white',
                border: 'black'
              },
              hover: {
                background: 'white',
                border: 'black'
              }

            },

          };

          if(!this.conceptNetworkData.nodes.getById(isPartOfNode.id)) {
            this.conceptNetworkData.nodes.add(isPartOfNode);
          }

          let isPartOfEdge = {
            from: rootConceptNodeId,
            to: isPartOfNode.id,
            dashes: true,
            id: rootConceptNodeId + isPartOfNode.id
          };
          this.conceptNetworkData.edges.add(isPartOfEdge);
        });
      }
    };
  }

  public ngOnDestroy(): void {
    this.visNetworkService.off(this.conceptNetwork, 'stabilizationIterationsDone');
    this.visNetworkService.off(this.conceptNetwork, 'click');
  }
}