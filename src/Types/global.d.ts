// 接口返回值基本类型
declare interface ApiRes {
  code: string;
  message: string | null;
  result: any;
}

// 路由页面面包屑
interface BreadV {
  name: string;
  href?: string;
}
declare interface P {
  bread(_: BreadV[]): any;
}

declare interface IterateS {
  [_: string]: any
}
declare interface IterateN {
  [_: number]: any
}
