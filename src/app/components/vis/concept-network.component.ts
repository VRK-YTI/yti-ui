import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import {Node} from '../../entities/node';
import { stripMarkdown } from '../../utils/markdown';

import {
  VisNodes,
  VisEdges,
  VisNetworkService,
  VisNetworkData,
  VisNetworkOptions } from 'ng2-vis';
import {LanguageService} from "../../services/language.service";

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

  @Input() rootConcept:Node<'Concept'>;

  public constructor(private visNetworkService: VisNetworkService,
                     private languageService: LanguageService) { }


  public networkInitialized(): void {
    this.visNetworkService.on(this.conceptNetwork, 'stabilizationIterationsDone');
    this.visNetworkService.stabilizationIterationsDone.subscribe((eventData: any) => {
      if (eventData === this.conceptNetwork) {
        this.visNetworkService.setOptions(this.conceptNetwork, { physics: false });
        let visFitOpts = {nodes: [this.rootConceptId], animation: false};
        this.visNetworkService.fit(this.conceptNetwork, visFitOpts);
      }
    });
  }

  public ngOnInit(): void {
    if(this.rootConcept) {
      this.rootConceptId = this.rootConcept.id;
      console.log(this.rootConcept);

      let relatedConcepts: Node<'Concept'>[] = this.rootConcept.references['related']['values'];
      let broaderConcepts: Node<'Concept'>[] = this.rootConcept.referrers['broader'];
      let isPartOfConcepts: Node<'Concept'>[] = this.rootConcept.referrers['isPartOf'];
      console.log('related concepts: ', relatedConcepts);
      console.log('broader concepts: ', broaderConcepts);
      console.log('isPartOf concepts: ', isPartOfConcepts);
      let rootVisNode = {
        id: this.rootConceptId,
        label: this.languageService.translate(this.rootConcept.label),
        title: '<div style="max-width: 30%">' + stripMarkdown(this.languageService.translate(this.rootConcept.definition)) + '</div>',
        group: 'rootGroup',
        color: 'blue'
      };

      let nodes = new VisNodes([rootVisNode]);
      let edges = new VisEdges();

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
          nodes.add(relNode);

          let relEdge = {
            from: this.rootConceptId,
            to: relNode.id,
            arrows: {
              to: {
                enabled: true,
                scaleFactor: 0.7,
                type: 'arrow'
              }
            },
            id: this.rootConceptId + relNode.id
          };
          edges.add(relEdge);
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
          console.log(nodes.getById(broaderConcept.id));
          if(nodes.getById(broaderConcept.id)) {
            nodes.remove(broaderConcept.id);
            edges.remove(this.rootConceptId + broaderConcept.id);
          }
          nodes.add(broaderNode);

          let broaderEdge = {
            from: this.rootConceptId,
            to: broaderNode.id,
            id: this.rootConceptId + broaderNode.id
          };
          edges.add(broaderEdge);
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
          nodes.add(isPartOfNode);

          let isPartOfEdge = {
            from: this.rootConceptId,
            to: isPartOfNode.id,
            dashes: true,
            id: this.rootConceptId + isPartOfNode.id
          };
          edges.add(isPartOfEdge);
        });
      }

      this.conceptNetworkData = {
        nodes: nodes,
        edges: edges
      };

      this.conceptNetworkOptions = {
        nodes: {
          shape: 'ellipse',
        },
        groups: {
          rootGroup: {font: {color: 'black'}},
          relatedGroup: { font: {color: 'black'}},
          broaderGroup: { font: {color: 'black'}},
          isPartOfGroup: { font: {color: 'black'}}
        },
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'UD',
            sortMethod: 'hubsize',
            parentCentralization: true,
            nodeSpacing: 200
          },
          improvedLayout: true
        },
        edges: {
          smooth: {
            enabled: false,
            type: "continuous",
            roundness: 0.5
          },
          length: 300,
          hoverWidth: 2,
          color: {
            color: 'black',
            highlight: 'blue',
            hover: 'blue'
          }
        },
        interaction: {
          hideEdgesOnDrag: false,
          hideNodesOnDrag: false,
          navigationButtons: true,
          hover: true,
          selectable: false,
          selectConnectedEdges: true
        },
        physics: {
          enabled: true,
        }
      };
    }
  }

  public ngOnDestroy(): void {
    this.visNetworkService.off(this.conceptNetwork, 'stabilizationIterationsDone');
  }
}