import times from 'whisk/times';

export const writeTableHeaderLine = (node) => `| ${node.content.map(toCellHeader).join(' | ')} |`;

const getHeaderLen = (cell) => cell.content.reduce((memo, item) => memo + (item.length || 0), 0);
const toCellHeader = (cell) => {
  let header = times(Math.max(getHeaderLen(cell), 3)).map(() => '-').join('');
  switch ((cell.flags || {}).align) {
    case 'left': {
      header = ':' + header.slice(1);
      break;
    }

    case 'right': {
      header = header.slice(0, -1) + ':';
      break;
    }

    case 'center': {
      header = ':' + header.slice(1, -1) + ':';
      break;
    }
  }

  return header;
};