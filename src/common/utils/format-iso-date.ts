export default function FormatISODate(ISODate: any, locale: string = 'fi') {
  if (ISODate) {
    let date = '';
    let hour = '';

    switch (locale) {
    case 'fi':
      date = ISODate.split('T')[0].split('-').reverse().join('.');
      hour = ISODate.split('T')[1].split('.')[0].split(':').slice(0, 2).join('.');

      return date + ', ' + hour;
    case 'en':
      let dateArr = ISODate.split('T')[0].split('-').reverse();
      dateArr = [date[1], date[0], date[2]];
      date = dateArr.join('/');

      hour = ISODate.split('T')[1].split('.')[0].split(':').slice(0, 2).join('.');

      return date + ', ' + hour;
    case 'sv':
      date = ISODate.split('T')[0].split('-').reverse().join('.');
      hour = ISODate.split('T')[1].split('.')[0].split(':').slice(0, 2).join('.');

      return date + ' kl. ' + hour;
    default:
      return '';
    }
  }

  return '';
}
