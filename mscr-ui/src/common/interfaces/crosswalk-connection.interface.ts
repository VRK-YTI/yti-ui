export interface CrosswalkConnection {
    source: string;
    target: string;
    sourceTitle: string;
    targetTitle: string;
    mappingType: string | undefined;
    notes: string | undefined;
    isSelected: boolean;
}