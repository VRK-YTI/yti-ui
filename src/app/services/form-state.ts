import { AbstractControl, FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { assertNever } from 'yti-common-ui/utils/object';
import { allMatching, anyMatching, firstMatching, flatten, normalizeAsArray, moveElement } from 'yti-common-ui/utils/array';
import { ConceptNode, KnownNode, Node, Property, Reference, TermNode } from 'app/entities/node';
import { Cardinality, Editor, MetaModel, NodeMeta, PropertyMeta, ReferenceMeta, ReferenceType } from 'app/entities/meta';
import { Localizable } from 'yti-common-ui/types/localization';
import { NodeType } from 'app/entities/node-api';
import { validateMeta } from 'app/utils/validator';
import { requiredList, validateLanguage } from 'yti-common-ui/utils/validator';
import { comparingPrimitive } from 'yti-common-ui/utils/comparator';
import { removeMatchingLinks } from 'app/utils/semantic';
import { Sortable } from 'app/directives/drag-sortable.directive';

export type FormReference = FormReferenceLiteral<any>
                          | FormReferenceTerm;

export type FormProperty = FormPropertyLiteral
                         | FormPropertyLiteralList
                         | FormPropertyLocalizable;

export type FormField = FormProperty
                      | FormReference;

export class FormNode {

  control = new FormGroup({});
  fields: { name: string, value: FormField }[] = [];

  constructor(private node: Node<any>, public languagesProvider: () => string[], metaModel: MetaModel) {

    const createFormReference = (name: string, reference: Reference<any>) => {
      if (reference.term) {
        return new FormReferenceTerm(reference, languagesProvider, metaModel);
      } else {
        return new FormReferenceLiteral(reference);
      }
    };

    const createFormProperty = (property: Property) => {

      switch (property.meta.type.type) {
        case 'localizable':
          const fixed = node.type === 'Term' && property.meta.id === 'prefLabel';
          return new FormPropertyLocalizable(property, languagesProvider, fixed);
        case 'string':
          switch (property.meta.type.cardinality) {
            case 'single':
              return new FormPropertyLiteral(property);
            case 'multiple':
              return new FormPropertyLiteralList(property);
            default:
              return assertNever(property.meta.type.cardinality);
          }
        default:
          return assertNever(property.meta.type);
      }
    };

    const fields = [...node.getAllProperties(), ...node.getAllReferences()];

    fields.sort(
      comparingPrimitive<Property|Reference<any>>(f => f.meta.index)
        .andThen(comparingPrimitive<Property|Reference<any>>(f => f instanceof Property)));

    for (const field of fields) {

      const name = field.meta.id;

      if (field instanceof Property) {
        const property = createFormProperty(field);
        this.control.addControl('property-' + name, property.control);
        this.fields.push({value: property, name});
      } else {
        const reference = createFormReference(name, field);
        this.control.addControl('reference-' + name, reference.control);
        this.fields.push({value: reference, name});
      }
    }
  }

  get properties() {
    return this.fields
      .filter(f => f.value.fieldType === 'property')
      .map( f => f as { name: string, value: FormProperty });
  }

  get references() {
    return this.fields
      .filter(f => f.value.fieldType === 'reference')
      .map( f => f as { name: string, value: FormReference });
  }

  get prefLabelProperty(): { lang: string, value: string }[] {

    const property = firstMatching(this.properties, child => child.name === 'prefLabel');

    if (!property) {
      throw new Error('prefLabel not found in properties');
    }

    if (!(property.value instanceof FormPropertyLocalizable)) {
      throw new Error('prefLabel is not localizable');
    }

    return (property.value as FormPropertyLocalizable).value;
  }

  // TODO refactor term component to not use this method
  hasStatus(): boolean {
    return this.node.hasStatus();
  }

  // TODO refactor term component to not use this method
  get status(): string {

    if (!this.node.hasStatus()) {
      throw new Error('Node does not have status');
    }

    return this.node.status;
  }

  hasConceptReference(conceptId: string) {
    return anyMatching(this.referencedConcepts, concept => concept.id === conceptId);
  }

  hasRelatedConcepts() {
    return anyMatching(this.references, child => child.name === 'related');
  }

  get relatedConcepts() {
    return firstMatching(this.references, child => child.name === 'related')!.value as FormReferenceLiteral<ConceptNode>;
  }

  get referencedConcepts(): ConceptNode[] {
    return flatten(this.references
      .filter(ref => ref.value.targetType === 'Concept')
      .map(ref => ref.value.value as ConceptNode[])
    );
  }

  get semanticProperties(): FormProperty[] {
    return this.properties
      .map(p => p.value)
      .filter(p => p.editor.type === 'semantic');
  }

  removeSemanticReferencesTo(concept: ConceptNode, namespaceRoot: string) {
    for (const property of this.semanticProperties) {
      property.removeSemanticReferencesTo(concept, namespaceRoot);
    }
  }

  get hasNonEmptyPrefLabel(): boolean {
    const property = firstMatching(this.properties, p => p.name === 'prefLabel');
    return !!property && !property.value.valueEmpty;
  }

  get value(): Node<any> {
    const result = this.node.clone();
    this.assignChanges(result);
    return result;
  }

  assignChanges(node: Node<any>) {

    for (const {name, value} of this.properties) {
      value.assignChanges(node.getProperty(name));
    }

    for (const {name, value} of this.references) {
      value.assignChanges(node.getReference(name));
    }
  }
}

export class FormReferenceLiteral<N extends KnownNode | Node<any>> implements Sortable<N> {

  fieldType: 'reference' = 'reference';
  type: 'literal' = 'literal';
  control: FormControl;
  private meta: ReferenceMeta;
  private targetMeta: NodeMeta;

  constructor(reference: Reference<N>) {

    this.meta = reference.meta;
    this.control = new FormControl(reference.values, this.required ? [requiredList] : []);
    this.targetMeta = reference.targetMeta;
  }

  get sortableValues(): N[] {
    return this.value;
  }

  set sortableValues(values: N[]) {
    this.control.setValue(values);
  }

  moveItem(fromIndex: number, toIndex: number): void {
    const copy = this.value.slice();
    moveElement(copy, fromIndex, toIndex);
    this.control.setValue(copy);
  }

  get label(): Localizable {
    return this.meta.label;
  }

  get description(): Localizable {
    return this.meta.description;
  }

  get required(): boolean {
    return this.meta.required;
  }

  get referenceType(): ReferenceType {
    return this.meta.referenceType;
  }

  get targetType(): NodeType {
    return this.meta.targetType;
  }

  addReference(target: N) {
    this.control.setValue([...this.value, target]);
  }

  removeReference(target: N) {
    this.control.setValue(this.value.filter(v => v !== target));
  }

  get graphId() {
    return this.meta.graphId;
  }

  get value(): N[] {
    return normalizeAsArray(this.control.value);
  }

  get targetGraph() {
    return this.targetMeta.graphId;
  }

  get term() {
    return false;
  }

  get valueEmpty(): boolean {
    return this.value.length === 0;
  }

  assignChanges(reference: Reference<any>) {
    reference.values = this.value;
  }

  hasContentForLanguage(language: string) {
    return !this.valueEmpty;
  }
}

export interface TermChild {
  formNode: FormNode;
  language: string;
  id: string;
  idIdentifier: string;
}

export class FormReferenceTerm implements Sortable<TermChild> {

  fieldType: 'reference' = 'reference';
  type: 'term' = 'term';
  control: FormArray;
  children: TermChild[];
  private meta: ReferenceMeta;
  private targetMeta: NodeMeta;

  constructor(reference: Reference<TermNode>, public languagesProvider: () => string[], private metaModel: MetaModel) {

    this.meta = reference.meta;
    this.targetMeta = reference.targetMeta;

    this.children = reference.values
      .filter(term => term.isValid())
      .map(term => ({
        formNode: new FormNode(term, languagesProvider, metaModel),
        language: term.language!,
        id: term.id,
        idIdentifier: term.idIdentifier
      }));

    const childControls = this.children.map(c => c.formNode.control);
    this.control = new FormArray(childControls, this.required ? requiredList : null);
  }

  get sortableValues(): TermChild[] {
    return this.children;
  }

  set sortableValues(values: TermChild[]) {
    values.forEach((c, i) => this.control.setControl(i, c.formNode.control));
    this.children = values;
  }

  moveItem(fromIndex: number, toIndex: number): void {
    const copy = this.children.slice();
    moveElement(copy, fromIndex, toIndex);
    this.sortableValues = copy;
  }

  get addedLanguages() {
    return Array.from(new Set(this.children.map(c => c.language)));
  }

  get label(): Localizable {
    return this.meta.label;
  }

  get description(): Localizable {
    return this.meta.description;
  }

  get referenceType(): ReferenceType {
    return this.meta.referenceType;
  }

  get targetType(): NodeType {
    return this.meta.targetType;
  }

  get required(): boolean {
    return this.meta.required;
  }

  get cardinality() {
    return this.meta.cardinality;
  }

  get graphId() {
    return this.meta.graphId;
  }

  get value(): TermNode[] {
    return this.children.map(child => child.formNode.value as TermNode);
  }

  addTerm(metaModel: MetaModel, language: string) {

    const newTerm = this.metaModel.createEmptyTerm(this.graphId, language);

    const newChild = {
      formNode: new FormNode(newTerm, this.languagesProvider, this.metaModel),
      language: language,
      id: newTerm.id,
      idIdentifier: newTerm.idIdentifier
    };

    this.children.push(newChild);
    this.control.push(newChild.formNode.control);
  }

  remove(child: TermChild) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
    this.control.removeAt(index);
  }

  get term() {
    return true;
  }

  get valueEmpty(): boolean {
    return this.value.length === 0;
  }

  assignChanges(reference: Reference<any>) {
    reference.values = this.value;
  }

  hasContentForLanguage(language: string) {
    const isNotEmpty = (value: TermNode) => value.term;
    return anyMatching(this.value, v => v.language === language && isNotEmpty(v));
  }
}

export class FormPropertyLiteral {

  fieldType: 'property' = 'property';
  type: 'literal' = 'literal';
  control: FormControl;
  private meta: PropertyMeta;

  constructor(property: Property) {
    this.meta = property.meta;
    this.control = this.createControl(property.literalValue);
  }

  get required(): boolean {
    return this.meta.type.required;
  }

  private createControl(initial: string) {

    const validators: ValidatorFn[] = [(control: FormControl) => validateMeta(control, this.meta)];

    if (this.required) {
      validators.push(Validators.required);
    }

    if (this.editor.type === 'language') {
      validators.push(validateLanguage);
    }

    return new FormControl(initial, validators);
  }

  get label(): Localizable {
    return this.meta.label;
  }

  get description(): Localizable {
    return this.meta.description;
  }

  get editor(): Editor {
    return this.meta.type.editor;
  }

  get value() {
    return this.control.value;
  }

  get multiColumn() {
    return this.meta.multiColumn;
  }

  get valueEmpty() {
    return this.value.trim() === '';
  }

  removeSemanticReferencesTo(concept: ConceptNode, namespaceRoot: string) {
    if (this.editor.type === 'semantic') {
      const shouldRemoveDestination = (dest: string) => concept.isTargetOfLink(dest);
      this.control.setValue(removeMatchingLinks(this.value, this.editor.format, shouldRemoveDestination, namespaceRoot));
    }
  }

  assignChanges(property: Property) {

    const regex = this.meta.regex;
    property.attributes = [{ lang: '', value: this.value, regex }];
  }

  hasContentForLanguage(language: string) {
    return !this.valueEmpty;
  }
}

export class FormPropertyLiteralList implements Sortable<AbstractControl> {

  fieldType: 'property' = 'property';
  type: 'literal-list' = 'literal-list';
  control: FormArray;
  private meta: PropertyMeta;

  constructor(property: Property) {

    this.meta = property.meta;
    const children = property.attributes.map(a => a.value).map(value => this.createChildControl(value));
    this.control = new FormArray(children, this.required ? requiredList : null);
  }

  private createChildControl(initial: string): FormControl {

    const validators: ValidatorFn[] = [(control: FormControl) => validateMeta(control, this.meta)];

    if (this.required) {
      validators.push(Validators.required);
    }

    if (this.editor.type === 'language') {
      validators.push(validateLanguage);
    }

    return new FormControl(initial, validators);
  }

  get sortableValues(): AbstractControl[] {
    return this.children;
  }

  moveItem(fromIndex: number, toIndex: number): void {

    const copy = this.control.controls.slice();
    moveElement(copy, fromIndex, toIndex);
    this.sortableValues = copy;
  }

  set sortableValues(values: AbstractControl[]) {
    values.forEach((c, i) => this.control.setControl(i, c));
  }

  get children() {
    return this.control.controls;
  }

  get label(): Localizable {
    return this.meta.label;
  }

  get description(): Localizable {
    return this.meta.description;
  }

  get required(): boolean {
    return this.meta.type.required;
  }

  get editor(): Editor {
    return this.meta.type.editor;
  }

  get value(): string[] {
    return this.children.map(control => control.value);
  }

  get valueAsString() {
    return this.value.join(',');
  }

  append(initial: string) {
    const control = this.createChildControl(initial);
    this.control.push(control);
  }

  remove(child: FormControl) {
    this.control.removeAt(this.children.indexOf(child));
  }

  removeSemanticReferencesTo(concept: ConceptNode, namespaceRoot: string) {

    if (this.editor.type === 'semantic') {

      const shouldRemoveDestination = (dest: string) => concept.isTargetOfLink(dest);

      for (const child of this.children) {
        child.setValue(removeMatchingLinks(child.value, this.editor.format, shouldRemoveDestination, namespaceRoot));
      }
    }
  }

  get multiColumn() {
    return this.meta.multiColumn;
  }

  get valueEmpty() {
    return allMatching(this.value, v => v.trim() === '');
  }

  assignChanges(property: Property) {

    const regex = this.meta.regex;
    property.attributes = this.value.map(value => ({ lang: '', value, regex }));
  }

  hasContentForLanguage(language: string) {
    return !this.valueEmpty;
  }
}

interface LocalizedControl {
  lang: string;
  control: FormControl;
}

export class FormPropertyLocalizable implements Sortable<LocalizedControl> {

  fieldType: 'property' = 'property';
  type: 'localizable' = 'localizable';
  control: FormArray;
  children: LocalizedControl[];
  private meta: PropertyMeta;

  constructor(property: Property, private languagesProvider: () => string[], public fixed: boolean) {

    this.meta = property.meta;
    this.children = property.attributes.map(attribute => ({
      lang: attribute.lang,
      control: this.createChildControl(attribute.value)
    }));
    const childControls = this.children.map(c => c.control);
    this.control = new FormArray(childControls, this.required ? requiredList : null);
  }

  get sortableValues(): LocalizedControl[] {
    return this.children;
  }

  set sortableValues(values: LocalizedControl[]) {
    values.forEach((c, i) => this.control.setControl(i, c.control));
    this.children = values;
  }

  moveItem(fromIndex: number, toIndex: number): void {
    const copy = this.children.slice();
    moveElement(copy, fromIndex, toIndex);
    this.sortableValues = copy;
  }

  get languages() {
    return this.languagesProvider();
  }

  private createChildControl(initial: string): FormControl {

    const validators: ValidatorFn[] = [(control: FormControl) => validateMeta(control, this.meta)];

    if (this.required) {
      validators.push(Validators.required);
    }

    return new FormControl(initial, validators);
  }

  get addedLanguages() {
    return Array.from(new Set(this.value.map(v => v.lang)));
  }

  get label(): Localizable {
    return this.meta.label;
  }

  get description(): Localizable {
    return this.meta.description;
  }

  get required(): boolean {
    return this.meta.type.required;
  }

  get editor(): Editor {
    return this.meta.type.editor;
  }

  get cardinality(): Cardinality {
    return this.meta.type.cardinality;
  }

  get value(): { lang: string, value: string }[] {
    return this.children.map(({ lang, control }) => ({ lang, value: control.value }));
  }

  append(lang: string, initial: string) {
    const control = this.createChildControl(initial);
    this.children.push({lang, control});
    this.control.push(control);
  }

  remove(child: { lang: string, control: FormControl }) {
    const index = this.children.indexOf(child);
    this.children.splice(index, 1);
    this.control.removeAt(index);
  }

  removeSemanticReferencesTo(concept: ConceptNode, namespaceRoot: string) {
    if (this.editor.type === 'semantic') {
      const shouldRemoveDestination = (destination: string) => concept.isTargetOfLink(destination);
      for (const child of this.children) {
        child.control.setValue(removeMatchingLinks(child.control.value, this.editor.format, shouldRemoveDestination, namespaceRoot));
      }
    }
  }

  get multiColumn() {
    return this.meta.multiColumn;
  }

  get valueEmpty() {
    return allMatching(this.value, v => v.value.trim() === '');
  }

  assignChanges(property: Property) {

    const regex = this.meta.regex;
    property.attributes = this.value.map(localization => ({ lang: localization.lang, value: localization.value, regex }));
  }

  hasContentForLanguage(language: string) {
    const isNotEmpty = (value: string) => value.trim() !== '';
    return anyMatching(this.value, v => v.lang === language && isNotEmpty(v.value));
  }
}
