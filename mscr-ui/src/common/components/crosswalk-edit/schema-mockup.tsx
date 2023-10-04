import React, {useState} from 'react';
import {cloneDeep} from 'lodash';
import {RenderTree} from "@app/common/interfaces/crosswalk-connection.interface";

export default function MockupSchemaLoader(emptyTemplate: boolean) {
    const testData: any = {
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'type': 'object',
        'properties': {
            '$schema': {
                'type': 'string'
            },
            'string_type': {
                'type': 'string',
                'description': '01_string_description'
            },
            'number_type': {
                'type': 'number',
                'minimum': 3,
                'exclusiveMinimum': false
            },
            'integer_type': {
                'type': 'integer',
                'minimum': 2
            },
            'boolean_type': {
                'type': 'boolean'
            },
            'null_type': {
                'type': 'null'
            },
            'object_type': {
                'title': 'OBJECT TYPE',
                'type': 'object',
                'properties': {
                    'string_property': {
                        'title': 'string_prop',
                        'type': 'string'
                    }
                },
                'required': ['string_property']
            },
            'array_string_type': {
                'type': 'array',
                'maxItems': 5,
                'items': {
                    'type': 'string'
                }
            },
            'object_arrays_type': {
                'type': 'object',
                'properties': {
                    'array_property': {
                        'title': 'array_prop',
                        'type': 'array',
                        'items': {
                            'type': 'number'
                        }
                    }
                }
            }
        },
        'additionalProperties': false,
        'b2share': {
            'presentation': {
                'major': ['community', 'titles', 'descriptions', 'creators', 'open_access', 'embargo_date', 'license', 'disciplines', 'keywords', 'contact_email'],
                'minor': ['contributors', 'resource_types', 'alternate_identifiers', 'version', 'publisher', 'language']
            }
        }
    };

    const testSchema: any = {
        '$schema': 'http://json-schema.org/draft-04/schema#',
        'type': 'object',
        'properties': {
            '$schema': {
                'type': 'string'
            },
            'creators': {
                'title': 'Creators',
                'description': 'The full name of the creators. The personal name format should be: family, given (e.g.: Smith, John).',
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'creator_name': {
                            'type': 'string'
                        }
                    },
                    'additionalProperties': false,
                    'required': ['creator_name']
                },
                'uniqueItems': true
            },
            'titles': {
                'title': 'Titles',
                'description': 'The title(s) of the uploaded resource, or a name by which the resource is known.',
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'title': {
                            'type': 'string'
                        }
                    },
                    'additionalProperties': false,
                    'required': ['title']
                },
                'minItems': 1,
                'uniqueItems': true
            },
            'publisher': {
                'title': 'Publisher',
                'description': 'The entity responsible for making the resource available, either a person, an organization, or a service.',
                'type': 'string'
            },
            'publication_date': {
                'title': 'Publication Date',
                'description': 'The date when the data was or will be made publicly available (e.g. 1971-07-13)',
                'type': 'string',
                'format': 'date'
            },
            'disciplines': {
                'title': 'Disciplines',
                'description': 'The scientific disciplines linked with the resource.',
                'type': 'array',
                'items': {
                    'type': 'string'
                },
                'uniqueItems': true
            },
            'keywords': {
                'title': 'Keywords',
                'description': 'A list of keywords or key phrases describing the resource.',
                'type': 'array',
                'items': {
                    'type': 'string'
                },
                'uniqueItems': true
            },
            'contributors': {
                'title': 'Contributors',
                'description': 'The list of all other contributors. Please mention all persons that were relevant in the creation of the resource.',
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'contributor_name': {
                            'title': 'Name',
                            'type': 'string'
                        },
                        'contributor_type': {
                            'title': 'Type',
                            'enum': ['ContactPerson', 'DataCollector', 'DataCurator', 'DataManager', 'Distributor', 'Editor', 'HostingInstitution', 'Producer', 'ProjectLeader', 'ProjectManager', 'ProjectMember', 'RegistrationAgency', 'RegistrationAuthority', 'RelatedPerson', 'Researcher', 'ResearchGroup', 'RightsHolder', 'Sponsor', 'Supervisor', 'WorkPackageLeader', 'Other']
                        }
                    },
                    'additionalProperties': false,
                    'required': ['contributor_name', 'contributor_type']
                },
                'uniqueItems': true
            },
            'language': {
                'title': 'Language',
                'description': 'The primary language of the resource. Please use ISO_639-3 language codes.',
                'type': 'string'
            },
            'resource_types': {
                'title': 'Resource Type',
                'description': 'The type(s) of the resource.',
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'resource_type': {
                            'title': 'Description',
                            'type': 'string'
                        },
                        'resource_type_general': {
                            'title': 'Category',
                            'enum': ['Audiovisual', 'Collection', 'Dataset', 'Event', 'Image', 'InteractiveResource', 'Model', 'PhysicalObject', 'Service', 'Software', 'Sound', 'Text', 'Workflow', 'Other']
                        }
                    },
                    'additionalProperties': false,
                    'required': ['resource_type_general']
                },
                'minItems': 1,
                'uniqueItems': true
            },
            'alternate_identifiers': {
                'title': 'Alternate identifiers',
                'description': 'Any kind of other reference such as a URN, URI or an ISBN number.',
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'alternate_identifier': {
                            'type': 'string'
                        },
                        'alternate_identifier_type': {
                            'title': 'Type',
                            'type': 'string'
                        }
                    },
                    'additionalProperties': false,
                    'required': ['alternate_identifier', 'alternate_identifier_type']
                },
                'uniqueItems': true
            },
            'descriptions': {
                'title': 'Descriptions',
                'description': 'A more elaborate description of the resource. Focus on a content description that makes it easy for others to find, and to interpret its relevance.',
                'type': 'array',
                'items': {
                    'type': 'object',
                    'properties': {
                        'description': {
                            'type': 'string'
                        },
                        'description_type': {
                            'title': 'Type',
                            'enum': ['Abstract', 'Methods', 'SeriesInformation', 'TableOfContents', 'TechnicalInfo', 'Other']
                        }
                    },
                    'additionalProperties': false,
                    'required': ['description', 'description_type']
                },
                'uniqueItems': true
            },
            'version': {
                'title': 'Version',
                'description': 'Denote the version of the resource.',
                'type': 'string'
            },
            'contact_email': {
                'title': 'Contact Email',
                'description': 'Contact email information for this record.',
                'type': 'string',
                'format': 'email'
            },
            'open_access': {
                'title': 'Open Access',
                'description': 'Indicate whether the record\'s files are publicly accessible or not. In case of restricted access the uploaded files will only be accessible by the record\'s owner and the community administrators. Please note that the record\'s metadata is always publicly accessible. ',
                'type': 'boolean'
            },
            'embargo_date': {
                'title': 'Embargo Date',
                'description': 'The date marking the end of the embargo period. The record will be marked as open access on the specified date at midnight. Please note that the record metadata is always publicly accessible, and only the data files can have private access.',
                'type': 'string',
                'format': 'date-time'
            },
            'license': {
                'title': 'License',
                'description': 'Specify the license under which this data set is available to the users (e.g. GPL, Apache v2 or Commercial). Please use the License Selector for help and additional information.',
                'type': 'object',
                'properties': {
                    'license': {
                        'type': 'string'
                    },
                    'license_uri': {
                        'title': 'License URL',
                        'type': 'string',
                        'format': 'uri'
                    }
                },
                'additionalProperties': false,
                'required': ['license']
            },
            'community': {
                'title': 'Community',
                'description': 'The community to which the record has been submitted.',
                'type': 'string'
            },
            'community_specific': {
                'type': 'object'
            },
            'publication_state': {
                'title': 'Publication State',
                'description': 'State of the publication workflow.',
                'type': 'string',
                'enum': ['draft', 'submitted', 'published']
            },
            '_pid': {
                'title': 'Persistent Identifiers',
                'description': 'Array of persistent identifiers pointing to this record.'
            },
            '_deposit': {
                'type': 'object'
            },
            '_oai': {
                'type': 'object'
            },
            '_files': {
                'type': 'array'
            }
        },
        'required': ['community', 'titles', 'open_access', 'publication_state', 'community_specific'],
        'additionalProperties': false,
        'b2share': {
            'presentation': {
                'major': ['community', 'titles', 'descriptions', 'creators', 'open_access', 'embargo_date', 'license', 'disciplines', 'keywords', 'contact_email'],
                'minor': ['contributors', 'resource_types', 'alternate_identifiers', 'version', 'publisher', 'language']
            }
        }
    };

    let allTreeNodes: RenderTree[] = [];

    let currentTreeNode: RenderTree = {
        isMappable: '',
        jsonPath: '$schema',
        parentName: '',
        isLinked: false,
        idNumeric: 0,
        id: '0',
        name: '',
        title: '',
        type: '',
        description: '',
        required: '',
        parentId: 0,
        children: []
    };

    let nodeId = 0;

    function increaseNodeNumber() {
        nodeId += 1;
    }

    function addObjectToTree(object: string, value: string, parent: string, rootId: any, jsonPath: string) {
        currentTreeNode.jsonPath = jsonPath + '.' + object + '(LEAF)';
        currentTreeNode.idNumeric = nodeId;
        currentTreeNode.id = nodeId.toString();
        currentTreeNode.parentId = rootId;

         if (object === 'description') {
             currentTreeNode.description = value;
         } else if (object === 'title') {
             currentTreeNode.title = value;
         }

        currentTreeNode.name = object;
        currentTreeNode.title = value;
        currentTreeNode.parentName = parent;

        increaseNodeNumber();
    }

    function walkJson(json_object: any, parent: any, rootId: number, jsonPath: string) {
        //console.log('WALK JSON', json_object);
        for (const obj in json_object) {
            if (typeof json_object[obj] === 'string') {
                //console.log(`${obj} = ${json_object[obj]}`);

                // OBJECT IS A LEAF LEVEL OBJECT
                currentTreeNode = {
                    isLinked: false, idNumeric: 0, id: '0', name: '', title: '', type: 'string', description: '', required: '', parentId: 0, jsonPath, children: []};
                addObjectToTree(obj, json_object[obj], parent, rootId, jsonPath);
                allTreeNodes.push(cloneDeep(currentTreeNode));
                }
            else if (Array.isArray(json_object[obj])) {
                //console.log('IS ARRAY!');
            } else {
                // OBJECT HAS CHILDREN
                currentTreeNode = {
                    isLinked: false, idNumeric: 0, id: '0', name: '', title: '', type: 'composite', description: '', required: '', parentId: 0, jsonPath, children: []};
                currentTreeNode.name = obj;
                currentTreeNode.parentName = parent;
                currentTreeNode.parentId = rootId;
                currentTreeNode.idNumeric = nodeId;
                currentTreeNode.id = nodeId.toString();


                currentTreeNode.jsonPath = jsonPath + '.' + obj;
                increaseNodeNumber();
                allTreeNodes.push(cloneDeep(currentTreeNode));
                walkJson(json_object[obj], obj, nodeId - 1, currentTreeNode.jsonPath);
            }
        }
        return allTreeNodes;
    }

    function processChildNodes() {
        for (let i = allTreeNodes.length - 1; i > 0; i -= 1) {
            if (allTreeNodes[i]) {
                allTreeNodes[allTreeNodes[i].parentId].children.push(cloneDeep(allTreeNodes[i]));
            }
        }
        return {allTreeNodes};
    }

    walkJson(emptyTemplate ? testSchema : currentTreeNode, null, 0, 'ROOT');
    processChildNodes();
        //console.log(allTreeNodes);
    return allTreeNodes;
}
