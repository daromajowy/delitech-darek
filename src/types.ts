export type PageId = 
  | 'home'
  | 'offices'
  | 'proav'
  | 'homes'
  | 'solutions'
  | 'architects'
  | 'knx'
  | 'projects'
  | 'knowledge'
  | 'about'
  | 'team'
  | 'contact';

export interface NavItem {
  id: PageId;
  label: string;
  subItems?: { id: string; label: string; hash?: string }[];
}
