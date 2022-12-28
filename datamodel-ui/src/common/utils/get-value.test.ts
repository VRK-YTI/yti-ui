import { initialModel } from '../interfaces/model.interface';
import {
  getComment,
  getContact,
  getCreated,
  getDocumentation,
  getGroup,
  getLink,
  getModified,
  getOrganization,
  getStatus,
  getTitle,
  getType,
} from './get-value';

describe('get-value', () => {
  it('should return title', () => {
    const titleFi = getTitle(initialModel, 'fi');
    const titleEn = getTitle(initialModel, 'en');
    const titleRandom = getTitle(initialModel, 'fr');

    expect(titleFi).toBe('label-fi');
    expect(titleEn).toBe('label-en');
    expect(titleRandom).toBe('label-fi (fi)');
  });

  it('should return type', () => {
    const type = getType(initialModel);

    expect(type).toBe('profile');
  });

  it('should return status', () => {
    const status = getStatus(initialModel);

    expect(status).toBe('VALID');
  });

  it('should return created', () => {
    const created = getCreated(initialModel);

    expect(created).toBe('created date');
  });

  it('should return modified', () => {
    const modified = getModified(initialModel);

    expect(modified).toBe('modified date');
  });

  it('should return comment', () => {
    const comment = getComment(initialModel);

    expect(comment).toBe('comment-fi');
  });

  it('should return contact', () => {
    const contact = getContact(initialModel);

    expect(contact).toBe('contact-fi');
  });

  it('should return documentation', () => {
    const documentation = getDocumentation(initialModel);

    expect(documentation).toBe('documentation-fi');
  });

  it('should return group', () => {
    const groupFi = getGroup(initialModel, 'fi');
    const groupEn = getGroup(initialModel, 'en');
    const groupRandom = getGroup(initialModel, 'fr');

    expect(groupFi).toStrictEqual(['group-1-name-fi', 'group-2-name-fi']);
    expect(groupEn).toStrictEqual(['group-1-name-en', 'group-2-name-en']);
    expect(groupRandom).toStrictEqual([
      'group-1-name-fi (fi)',
      'group-2-name-fi (fi)',
    ]);
  });

  it('should return organization', () => {
    const orgFi = getOrganization(initialModel, 'fi');
    const orgEn = getOrganization(initialModel, 'en');
    const orgRandom = getOrganization(initialModel, 'fr');

    expect(orgFi).toStrictEqual([
      'organization-1-name-fi',
      'organization-2-name-fi',
    ]);
    expect(orgEn).toStrictEqual([
      'organization-1-name-en',
      'organization-2-name-en',
    ]);
    expect(orgRandom).toStrictEqual([
      'organization-1-name-fi (fi)',
      'organization-2-name-fi (fi)',
    ]);
  });

  it('should return link', () => {
    const linkFi = getLink(initialModel, 'fi');
    const linkRandom = getLink(initialModel, 'de');

    expect(linkFi).toStrictEqual([
      {
        description: 'link-description-fi',
        title: 'link-title-fi',
        url: 'https://suomi.fi',
      },
    ]);

    expect(linkRandom).toStrictEqual([
      {
        description: 'link-description-fi (fi)',
        title: 'link-title-fi (fi)',
        url: 'https://suomi.fi',
      },
    ]);
  });
});
