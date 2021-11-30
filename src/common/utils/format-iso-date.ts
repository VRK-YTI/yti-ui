export default function FormatISODate(ISODate: any) {
  let date = ISODate.split('T')[0].split('-').reverse().join('.');
  let hour = ISODate.split('T')[1].split('.')[0].split(':').slice(0, 2).join('.');

  return date + ', ' + hour;
}
