export interface CrosswalkConnection {
    source: string;
    target: string;
    sourceTitle: string | undefined;
    targetTitle: string | undefined;
    sourceType: string | undefined;
    targetType: string | undefined;
    parentId: number | string;
    parentName: string | undefined;
    mappingType: string | undefined;
    notes: string | undefined;
    isSelected: boolean;
    description: string | undefined;
    type: string | undefined;
}

export interface RenderTree {
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
    parentId: number | string;
    children?: RenderTree[];
}