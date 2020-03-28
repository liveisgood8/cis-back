import tsoa from '../../tsoa.json';

export function api(path: string): string {
  return tsoa.routes.basePath + path;
}
