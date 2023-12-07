export interface CrosswalkConnection {
    source: string;
    target: string | string[];
    sourceTitle: string | undefined;
    targetTitle: string | undefined;
    sourceType: string | undefined;
    targetType: string | undefined;
    parentId: number | string;
    parentName: string | undefined;
    mappingType: string | undefined;
    notes: string | undefined;
    isSelected: boolean;
    sourceDescription: string | undefined;
    type: string | undefined;
}

export interface RenderTreeOld {
    idNumeric: number;
    id: string;
    name: string;
    isLinked: boolean;
    title?: string;
    type?: string;
    description?: string;
    required?: string;
    isMappable?: string;
    parentName?: string;
    jsonPath: string;
    parentId: number | string;
    children?: RenderTreeOld[];
}

export interface RenderTree {
    name: string;
    id: string;
    properties: any;
    elementPath: string;
    parentElementPath: string | undefined;
    children: RenderTree[];
}

export interface CrosswalkConnectionOld {
    source: RenderTreeOld;
    target: RenderTreeOld;
    id: string;
    description: string | undefined;
    isSelected: boolean;
    isDraft: boolean;
    sourceJsonPath: string | undefined;
    targetJsonPath: string | undefined;
    sourcePredicate: string | undefined;
    sourceProcessing: string | undefined;
    targetPredicate: string | undefined;
    targetProcessing: string | undefined;
}

export interface CrosswalkConnectionNew {
    source: RenderTree;
    target: RenderTree;
    id: string;
    description: string | undefined;
    isSelected: boolean;
    isDraft: boolean;
    sourceJsonPath: string | undefined;
    targetJsonPath: string | undefined;
    sourcePredicate: string | undefined;
    sourceProcessing: string | undefined;
    targetPredicate: string | undefined;
    targetProcessing: string | undefined;
}

export interface CrosswalkConnectionsNew {
    source: RenderTree[];
    target: RenderTree[];
    id: string;
    description: string | undefined;
}

export interface CrosswalkPayloadPrelim {
    sourceName: string;
    targetName: string;
    sourceJsonPath: string;
    targetJsonPath: string;
    id: string;
    description: string | undefined;
    filterFunction: string | undefined;
    sourceProcessing: string | undefined;
    targetProcessing: string | undefined;
}

