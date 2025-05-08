export enum Routes {
  main = '/',
  login = '/login',
  registration = '/registration',
  catalog = '/catalog',
  about = '/about-us',
  error = '/404',
}

export interface NavButtonProperties {
  text: string;
  route: Routes;
}
