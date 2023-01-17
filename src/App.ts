import { PostCreatePage } from './pages/PostCreatePage';
import { PostDetailPage } from './pages/PostDetailPage';
import { PostListPage } from './pages/PostListPage';

interface IApp {
  route: (data?: any) => void;
}

interface IAppConstructor {
  new ($parent: Element): IApp;
}

// ****************************************************************************

export const App = function (this: IApp, $parent: Element) {
  this.route = data => {
    const { pathname } = window.location;

    $parent.innerHTML = '';

    if (pathname === '/') {
      new PostListPage($parent).render();
    } else if (pathname.indexOf('/post/') === 0) {
      const [, , postID] = pathname.split('/');
      new PostDetailPage($parent, postID);
    } else if (pathname === '/create-post') {
      new PostCreatePage($parent, 'create', data);
    } else if (pathname === '/edit-post') {
      new PostCreatePage($parent, 'edit', data);
    }
  };

  this.route();

  window.addEventListener('ROUTE_CHANGE', (ev: CustomEvent) => {
    this.route(ev.detail);
  });
  window.addEventListener('popstate', this.route);
} as unknown as IAppConstructor;
