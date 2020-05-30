
export interface Option{
  id: string,
  title: string,
  link: string,
  operateTime?: Date
}

export interface Site{
  id: string,
  title?: string,
  urlName?: string,
  url: string,
  webUrl: string,
  options?: Array<Option>
}

export interface Server{
  id: string,
  title: string,
  sites?: Array<Site>
}