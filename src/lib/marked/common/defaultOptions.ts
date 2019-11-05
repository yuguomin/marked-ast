import { Renderer } from '../Renderer';

export interface IOptions {
  gfm?: boolean;
  tables?: boolean;
  breaks?: boolean;
  pedantic?: boolean;
  sanitize?: boolean;
  smartLists?: boolean;
  silent?: boolean;
  highlight?: any;
  langPrefix?: string;
  smartypants?: boolean;
  headerPrefix?: string;
  renderer?: any;
  xhtml?: boolean;
}

export const defaultOptions: IOptions = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer(),
  xhtml: false
};