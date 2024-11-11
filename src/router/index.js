/**
 * @author Jason.zou 305043598@qq.com
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

/*
说明：
affix: true, //是否显示关闭按钮
isHidden: true, //在菜单上不显示该页面
language: 'overview', //多语言设置
permissions: ["administrators"], //权限控制
badge： 菜单显示提示 是否为新增
noKeepAlive: false, 是否缓存，默认缓存
meta.target: '_blank', //外链
alwaysShow: true, //是否还有下级菜单

注：多路由出口时 会影响到keep-alive的使用
*/
Vue.use(VueRouter)
export let constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    isHidden: true,
  },
  {
    path: '/modifyPasswordResetLogin',
    component: () => import('@/views/login/resetLogin'),
    isHidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    isHidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/error/401'),
    isHidden: true,
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error/403'),
    isHidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404'),
    isHidden: true,
  },
  {
    path: '/MultiServerDashboardPage',
    name: 'MultiServerDashboardPage',
    component: () => import('@/views/multiServer/msDashboard'),
    isHidden: true,
    meta: {
      title: '多服务器看板',
      language: 'MultiServerDashboardPage',
      affix: false, //是否显示关闭按钮
      noKeepAlive: true
    },
  },
  {
    path: '/multiObjectDashboard',
    name: 'MultiObjectDashboard',
    component: () => import('@/views/multiServer/multiObjectDashboard'),
    isHidden: true,
    meta: {
      title: '多项目看板',
      language: 'MultiObjectDashboard',
      // icon: "desktop",
      affix: false, //是否显示关闭按钮
      noKeepAlive: true,
    },
  },
  {
    path: '/emailServer',
    name: 'EmailServer',
    component: () => import('@/views/emailServer'),
    isHidden: true,
    meta: {
      title: '邮件服务',
      language: 'EmailServer',
      affix: false, //是否显示关闭按钮
      noKeepAlive: true
    },
  },
  {
    path: '/Scan',
    name: 'Scan',
    component: () => import('@/components/ZScanQRCode/scan.vue'),
    isHidden: true
  },
  /*  {
     path: '/test',
     name: 'test',
     component: () => import('@/views/test/test.vue'),
     isHidden: true,
   } */
]

export let asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: {
      icon: 'home',
      permissions: []
    },
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('@/views/index/home.vue'),
        meta: {
          title: '首页', //i18n.t('overview'),//
          language: 'Home',
          icon: 'home',
          affix: true, //是否显示关闭按钮
          noKeepAlive: false,
          permissions: [],
        },
      },
    ],
  },
  /*   {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/report/dashboard/index'),
      meta: {
        title: '数据大屏',
        language: 'Dashboard',
        icon: "desktop",
        affix: false, //是否显示关闭按钮
        noKeepAlive: false,
        permissions: [],
      },
    }, */
  {
    path: "/report",
    name: "Report",
    component: Layout,
    redirect: "production",
    alwaysShow: true,
    meta: {
      title: "报表",
      icon: "chart-line",
      language: 'Report',
      permissions: [],
    },
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '概览',
          language: 'overview',
          icon: 'city',
          affix: false, //是否显示关闭按钮
          noKeepAlive: false,
          permissions: [],
        },
      },
      {
        path: "production",
        name: "Production",
        redirect: "UPH",
        alwaysShow: true,
        component: () => import("@/views/report"),
        meta: {
          title: "生产报表",
          // icon: "chart-line",
          language: 'Production',
          permissions: [],
        },
        children: [
          {
            path: "DG",
            name: "DG",
            redirect: "output",
            alwaysShow: true,
            component: () => import("@/views/report"),
            meta: {
              title: "东莞",
              // icon: "chart-line",
              language: 'DG',
              permissions: [],
            },
            children: [
              {
                path: "output",
                name: "Output",
                component: () => import("@/views/report/production/DG/output"),
                meta: {
                  title: "产出",
                  permissions: [],
                  language: "Output",
                },
              },
              {
                path: "OutputV2",
                name: "OutputV2",
                component: () => import("@/views/report/production/DG/output_v2"),
                meta: {
                  title: "产出V2",
                  permissions: [],
                  language: "OutputV2",
                },
              },
              {
                path: "OutputTVDashboard",
                name: "OutputTVDashboard",
                component: () => import("@/views/report/production/DG/OutputTVDashboard"),
                meta: {
                  title: '产出电视看板',
                  language: 'OutputTVDashboard',
                  permissions: [],
                  noKeepAlive: false
                }
              },
              {
                path: "OutputTVDashboardV2",
                name: "OutputTVDashboardV2",
                component: () => import("@/views/report/production/DG/output_v2/overview.vue"),
                meta: {
                  title: '产出电视看板V2',
                  language: 'OutputTVDashboardV2',
                  permissions: [],
                  noKeepAlive: false
                }
              },
              {
                path: "OutputOverview",
                name: "OutputOverview",
                component: () => import("@/views/report/production/DG/output/overview.vue"),
                meta: {
                  title: '产出概览',
                  language: 'OutputOverview',
                  permissions: [],
                  noKeepAlive: false
                }
              },

            ]
          },
          {
            path: "TH",
            name: "TH",
            redirect: "THOutput",
            alwaysShow: true,
            component: () => import("@/views/report"),
            meta: {
              title: "泰国",
              // icon: "chart-line",
              language: 'TH',
              permissions: [],
            },
            children: [
              {
                path: "THOutput",
                name: "THOutput",
                component: () => import("@/views/report/production/TH/output/indexTH.vue"),
                meta: {
                  title: "泰国产出",
                  permissions: [],
                  language: "THOutput",
                },
              },
              {
                path: "THOutputTVDashboard",
                name: "THOutputTVDashboard",
                component: () => import("@/views/report/production/TH/OutputTVDashboardTH"),
                meta: {
                  title: '泰国产出电视看板',
                  language: 'THOutputTVDashboard',
                  permissions: [],
                  noKeepAlive: false
                }
              },
            ]
          },
          {
            path: "UPH",
            name: "UPH",
            component: () => import("@/views/report/production/UPH"),
            meta: {
              title: "产能",
              permissions: [],
              language: "UPH",
            },
          },
          {
            path: "TVDashboard",
            name: "TVDashboard",
            component: () => import("@/views/report/production/TVDashboard"),
            meta: {
              title: '电视看板',
              language: 'TVDashboard',
              permissions: [],
              noKeepAlive: false
            }
          },

          {
            path: "OutputTVDashboardToLine",
            name: "OutputTVDashboardToLine",
            component: () => import("@/views/report/production/OutputTVDashboardToLine"),
            meta: {
              title: '产出电视看板按线',
              language: 'OutputTVDashboardToLine',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'dashboard',
            name: 'Dashboard',
            component: () => import('@/views/report/production/dashboard'),
            meta: {
              title: '数据看板',
              language: 'Dashboard',
              // icon: "desktop",
              // affix: true, //是否显示关闭按钮
              noKeepAlive: false,
              permissions: [],
            },
          },
          {
            path: 'dashboardV2',
            name: 'DashboardV2',
            component: () => import('@/views/report/production/dashboardV2'),
            meta: {
              title: '数据看板V2',
              language: 'DashboardV2',
              // icon: "desktop",
              // affix: true, //是否显示关闭按钮
              noKeepAlive: false,
              permissions: [],
              // target: '_blank'
            },
          },
          {
            path: 'dashboardV3',
            name: 'DashboardV3',
            component: () => import('@/views/report/production/dashboardV3'),
            meta: {
              title: '数据看板V3',
              language: 'DashboardV3',
              // icon: "desktop",
              // affix: true, //是否显示关闭按钮
              noKeepAlive: false,
              permissions: [],
              // target: '_blank'
            },
          },
          {
            path: 'analysis',
            name: 'Analysis',
            component: () => import('@/views/report/production/Analysis'),
            meta: {
              title: 'Analysis',
              language: 'Analysis',
              // icon: "desktop",
              // affix: true, //是否显示关闭按钮
              noKeepAlive: false,
              permissions: [],
            },
          },
          {
            path: 'warehouseSearchData',
            name: 'WarehouseSearchData',
            component: () => import("@/views/report/production/warehouseSearchData"),
            meta: {
              title: '仓库数据查询',
              language: 'WarehouseSearchData',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'searchCenter',
            name: 'SearchCenter',
            component: () => import("@/views/report/production/searchCenter"),
            meta: {
              title: '查询中心',
              language: 'SearchCenter',
              permissions: [],
              noKeepAlive: false
            }
          }
        ]
      },
      {
        path: "quality",
        name: "Quality",
        redirect: "yield",
        alwaysShow: true,
        component: () => import("@/views/report"),
        meta: {
          title: "品质报表",
          // icon: "chart-line",
          language: 'Quality',
          permissions: [],
        },
        children: [
          {
            path: "yield",
            name: "Yield",
            component: () => import("@/views/report/quality/yield"),
            meta: {
              title: "良率",
              language: 'Yield',
              // icon: "check",
              permissions: [],
              noKeepAlive: false
            },
          },
          {
            path: "defectRate",
            name: "DefectRate",
            component: () => import("@/views/report/quality/defectRate"),
            meta: {
              title: "不良",
              language: 'DefectRate',
              // icon: "hammer",
              permissions: [],
              noKeepAlive: false
            },
          },
          {
            path: "rawData",
            name: 'RawData',
            component: () => import('@/views/report/quality/rawData'),
            meta: {
              title: '原数据报表',
              language: 'RawData',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: "materialTraceability",
            name: 'MaterialTraceability',
            component: () => import('@/views/report/quality/materialTraceability'),
            meta: {
              title: '物料追溯',
              language: 'MaterialTraceability',
              permissions: [],
              noKeepAlive: false
            }
          }
        ]
      },
      {
        path: "tt",
        name: "TT",
        redirect: "wip-page",
        alwaysShow: true,
        component: () => import("@/views/report"),
        meta: {
          title: "TT报表",
          // icon: "chart-line",
          language: 'TTReport',
          permissions: [],
        },
        children: [
          {
            path: "wip-page",
            name: "WIPPage",
            component: () => import("@/views/report/TT/WIP"),
            meta: {
              title: "WIP",
              language: 'WIP',
              // icon: "check",
              permissions: [],
              noKeepAlive: false
            },
          },
          {
            path: "wip-list-page",
            name: "WIPListPage",
            component: () => import("@/views/report/TT/WIP/details.vue"),
            meta: {
              title: "WIPList",
              language: 'WIPList',
              // icon: "check",
              permissions: [],
              noKeepAlive: false
            },
          },
          {
            path: "wip2-page",
            name: "WIP2Page",
            component: () => import("@/views/report/TT/WIP2"),
            meta: {
              title: "WIP2",
              language: 'WIP2',
              // icon: "check",
              permissions: [],
              noKeepAlive: false
            },
          },
          {
            path: "wip2-list-page",
            name: "WIP2ListPage",
            component: () => import("@/views/report/TT/WIP2/details.vue"),
            meta: {
              title: "WIP2List",
              language: 'WIP2List',
              // icon: "check",
              permissions: [],
              noKeepAlive: false
            },
          },
        ]
      },
      {
        path: "SAP",
        name: "SAP",
        redirect: "CTB",
        alwaysShow: true,
        component: () => import("@/views/report"),
        meta: {
          title: "SAP",
          // icon: "chart-line",
          language: 'SAP',
          permissions: [],
        },
        children: [
          {
            path: "CTB",
            name: "CTB",
            component: () => import("@/views/report/SAP/CTB"),
            meta: {
              title: "CTB",
              language: 'CTB',
              // icon: "check",
              permissions: [],
              noKeepAlive: false
            },
          },
          {
            path: "CTBPro",
            name: "CTBPro",
            component: () => import("@/views/report/SAP/CTBPro"),
            meta: {
              title: "CTBPro",
              language: 'CTBPro',
              // icon: "check",
              permissions: [],
              noKeepAlive: false
            },
          }
        ]
      }
    ],
  },
  {
    path: "/application",
    name: "Application",
    component: Layout,
    alwaysShow: true,
    isHidden: false,
    meta: {
      title: "应用程序",
      icon: "fax",
      language: 'Application',
      permissions: [],
      IsShow: false
    },
    children: [
      {
        path: "overStation",
        name: "OverStation",
        component: () => import("@/views/application"),
        meta: {
          title: "过站",
          language: 'OverStation',
          permissions: [],
          IsShow: false
        },
        alwaysShow: true,
        children: [
          {
            path: "overStationOperation",
            name: "OverStationOperation",
            component: () => import("@/views/application/OS/overStation/index.vue"),
            meta: {
              title: "过站",
              language: 'OverStation',
              permissions: [],
            }
          },
        ]
      },
      {
        path: "QC",
        name: "QC",
        component: () => import("@/views/application"),
        meta: {
          title: "QC",
          // icon: "chart-line",
          language: 'QC',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "QCOperation",
            name: "QCOperation",
            component: () => import("@/views/application/QC/QC"),
            meta: {
              title: "QC",
              // icon: "chart-line",
              language: 'QC',
              permissions: [],
            }
          },
          {
            path: "IQC",
            name: "IQC",
            component: () => import("@/views/application/QC/IQC"),
            meta: {
              title: "IQC",
              // icon: "chart-line",
              language: 'IQC',
              permissions: [],
            }
          },
          {
            path: "KitQC",
            name: "KitQC",
            component: () => import("@/views/application/QC/KitQC"),
            meta: {
              title: "KitQC",
              // icon: "chart-line",
              language: 'KitQC',
              permissions: [],
            }
          },
          {
            path: "RepairQC",
            name: "RepairQC",
            component: () => import("@/views/application/QC/RepairQC"),
            meta: {
              title: "RepairQC",
              // icon: "chart-line",
              language: 'RepairQC',
              permissions: [],
            }
          },
        ]
      },
      {
        path: "TT",
        name: "TT",
        component: () => import("@/views/application"),
        meta: {
          title: "TT",
          // icon: "chart-line",
          language: 'TT',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "TTOverStation",
            name: "TTOverStation",
            component: () => import("@/views/application/TT/TTOverStation/index.vue"),
            meta: {
              title: "TT过站",
              language: 'TTOverStation',
              permissions: [],
            },
          },
          {
            path: "TTRegister",
            name: "TTRegister",
            component: () => import("@/views/application/TT/TTRegister/index.vue"),
            meta: {
              title: "TT注册",
              language: 'TTRegister',
              permissions: [],
            }
          },
          {
            path: "TTBoxBindingScan",
            name: "TTBoxBindingScan",
            component: () => import("@/views/application/TT/TTBoxBindingScan/index.vue"),
            meta: {
              title: "TT箱子绑定扫码",
              language: 'TTBoxBindingScan',
              permissions: [],
            }
          },
        ]
      },
      {
        path: "assemblyGroup",
        name: "AssemblyGroup",
        component: () => import("@/views/application"),
        meta: {
          title: "组装组",
          // icon: "chart-line",
          language: 'AssemblyGroup',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "assembly",
            name: "Assembly",
            component: () => import("@/views/application/assemblyGroup/assembly"),
            meta: {
              title: "组装",
              // icon: "chart-line",
              language: 'Assembly',
              permissions: [],
            }
          },
          {
            path: "assemblyDynamic",
            name: "AssemblyDynamic",
            component: () => import("@/views/application/assemblyGroup/assemblyDynamic"),
            meta: {
              title: "动态组装",
              // icon: "chart-line",
              language: 'AssemblyDynamic',
              permissions: [],
            }
          },
        ]
      },
      {
        path: "package",
        name: "Package",
        component: () => import("@/views/application"),
        meta: {
          title: "包装",
          // icon: "chart-line",
          language: 'Package',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "cartonBoxVerify",
            name: "CartonBoxVerify",
            component: () => import("@/views/application/package/CartonBoxVerify"),
            meta: {
              title: "中箱校验",
              // icon: "chart-line",
              language: 'CartonBoxVerify',
              permissions: [],
            }
          },
          {
            path: "cartonBox",
            name: "CartonBox",
            component: () => import("@/views/application/package/CartonBox"),
            meta: {
              title: "中箱",
              // icon: "chart-line",
              language: 'CartonBox',
              permissions: [],
            }
          },
          {
            path: "pallet",
            name: "Pallet",
            component: () => import("@/views/application/package/Pallet"),
            meta: {
              title: "栈板",
              // icon: "chart-line",
              language: 'Pallet',
              permissions: [],
            }
          },
          {
            path: "scalage",
            name: "Scalage",
            component: () => import("@/views/application/package/Scalage"),
            meta: {
              title: "中箱称重",
              // icon: "chart-line",
              language: 'Scalage',
              permissions: [],
            }
          },
          {
            path: "OOBA",
            name: "OOBA",
            component: () => import("@/views/application/package/OOBA"),
            meta: {
              title: "OOBA",
              // icon: "chart-line",
              language: 'OOBA',
              permissions: [],
            }
          },
          {
            path: "RMA",
            name: "RMA",
            component: () => import("@/views/application/package/RMA"),
            meta: {
              title: "RMA",
              // icon: "chart-line",
              language: 'RMA',
              permissions: [],
            }
          },
        ]
      },
      {
        path: "warehouse",
        name: "Warehouse",
        component: () => import("@/views/application"),
        meta: {
          title: "仓库",
          // icon: "chart-line",
          language: 'Warehouse',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "TH",
            name: "TH",
            component: () => import("@/views/application/warehouse"),
            meta: {
              title: "泰国",
              // icon: "chart-line",
              language: 'TH',
              permissions: [],
            },
            alwaysShow: true,
            children: [
              {
                path: "packOverStation",
                name: "PackOverStation",
                component: () => import("@/views/application/warehouse/TH/packOverStation"),
                meta: {
                  title: "包装过站",
                  // icon: "chart-line",
                  language: 'PackOverStation',
                  permissions: [],
                }
              },
              {
                path: "billShipment",
                name: "BillShipment",
                component: () => import("@/views/application/warehouse/TH/billShipment"),
                meta: {
                  title: "出货联单",
                  // icon: "chart-line",
                  language: 'BillShipment',
                  permissions: [],
                }
              },
              {
                path: "shipmentPallet",
                name: "ShipmentPallet",
                component: () => import("@/views/application/warehouse/TH/shipmentPallet"),
                meta: {
                  title: "出货卡板",
                  // icon: "chart-line",
                  language: 'ShipmentPallet',
                  permissions: [],
                }
              },
              {
                path: "projectBase",
                name: "ProjectBase",
                component: () => import("@/views/application/warehouse/TH/projectBase"),
                meta: {
                  title: "项目基础数据",
                  // icon: "chart-line",
                  language: 'ProjectBase',
                  permissions: [],
                }
              },
              {
                path: "SAPShipManifestData",
                name: "SAPShipManifestData",
                component: () => import("@/views/application/warehouse/TH/SAPShipManifestData"),
                meta: {
                  title: "SAP出货导出",
                  language: 'SAPShipManifestData',
                  permissions: [],
                }
              },
              {
                path: "SAPShipmentImport",
                name: "SAPShipmentImport",
                component: () => import("@/views/application/warehouse/TH/SAPShipmentImport"),
                meta: {
                  title: "SAP出货导入",
                  language: 'SAPShipmentImport',
                  permissions: [],
                }
              },
            ]
          },
          {
            path: "DG",
            name: "DG",
            component: () => import("@/views/application/warehouse"),
            meta: {
              title: "东莞",
              // icon: "chart-line",
              language: 'DG',
              permissions: [],
            },
            alwaysShow: true,
            children: [
              {
                path: "shippingData",
                name: "ShippingData",
                component: () => import("@/views/application/warehouse/DG/WH-DG"),
                meta: {
                  title: "出货数据",
                  // icon: "chart-line",
                  language: 'ShippingData',
                  permissions: [],
                }
              },
              {
                path: "DGWarehouseIn",
                name: "DGWarehouseIn",
                component: () => import("@/views/application/warehouse/DG/WH-In-DG"),
                meta: {
                  title: "仓库入库",
                  // icon: "chart-line",
                  language: 'DGWarehouseIn',
                  permissions: [],
                }
              },
              {
                path: "DGWarehouseOut",
                name: "DGWarehouseOut",
                component: () => import("@/views/application/warehouse/DG/WH-Out-DG"),
                meta: {
                  title: "仓库出库",
                  // icon: "chart-line",
                  language: 'DGWarehouseOut',
                  permissions: [],
                }
              },
              {
                path: "projectBase",
                name: "ProjectBase",
                component: () => import("@/views/application/warehouse/DG/projectBase"),
                meta: {
                  title: "项目基础数据",
                  // icon: "chart-line",
                  language: 'ProjectBase',
                  permissions: [],
                }
              },
            ]
          }

        ]
      },
      {
        path: "print",
        name: "Print",
        component: () => import("@/views/application"),
        meta: {
          title: "打印",
          language: 'Print',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "FGPrint",
            name: "FGPrint",
            component: () => import("@/views/application/print/FG"),
            meta: {
              title: "FG打印",
              language: 'FGPrint',
              permissions: [],
            }
          },
          {
            path: "repeatPrintFG",
            name: "RepeatPrintFG",
            component: () => import("@/views/application/print/repeatPrintFG/index.vue"),
            meta: {
              title: "FG重打印",
              language: 'RepeatPrintFG',
              permissions: [],
            }
          },
          {
            path: "UPCPrint",
            name: "UPCPrint",
            component: () => import("@/views/application/print/UPC"),
            meta: {
              title: "UPC打印",
              language: 'UPCPrint',
              permissions: [],
            }
          },
          {
            path: "repeatPrintUPC",
            name: "RepeatPrintUPC",
            component: () => import("@/views/application/print/repeatPrintUPC"),
            meta: {
              title: "UPC重打印",
              language: 'RepeatPrintUPC',
              permissions: [],
            }
          },
          {
            path: "FGDOEPrint",
            name: "FGDOEPrint",
            component: () => import("@/views/application/print/FG_DOE"),
            meta: {
              title: "FG-DOE打印",
              language: 'FGDOEPrint',
              permissions: [],
            }
          },
          {
            path: "FGDOENewPrint",
            name: "FGDOENewPrint",
            component: () => import("@/views/application/print/FG_DOENew"),
            meta: {
              title: "FG-DOE-New打印",
              language: 'FGDOENewPrint',
              permissions: [],
            }
          },
          {
            path: "FGNPIPrint",
            name: "FGNPIPrint",
            component: () => import("@/views/application/print/FG_NPI"),
            meta: {
              title: "FG-NPI打印",
              language: 'FGNPIPrint',
              permissions: [],
            }
          },
          {
            path: "ScanFGPrintUPC",
            name: "ScanFGPrintUPC",
            component: () => import("@/views/application/print/ScanFGPrintUPC"),
            meta: {
              title: "扫描FG打印UPC",
              language: 'ScanFGPrintUPC',
              permissions: [],
            }
          },
          {
            path: "ScanUPCPrintFG",
            name: "ScanUPCPrintFG",
            component: () => import("@/views/application/print/ScanUPCPrintFG"),
            meta: {
              title: "扫描UPC打印FG",
              language: 'ScanUPCPrintFG',
              permissions: [],
            }
          },
          {
            path: "ScanFixturePrintSN",
            name: "ScanFixturePrintSN",
            component: () => import("@/views/application/print/ScanFixturePrintSN"),
            meta: {
              title: "扫描夹具打印条码",
              language: 'ScanFixturePrintSN',
              permissions: [],
            }
          },
        ]
      },
      {
        path: "link",
        name: "Link",
        component: () => import("@/views/application"),
        meta: {
          title: "Link",
          language: 'Link',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "carrierLinkMaterialBatch",
            name: "CarrierLinkMaterialBatch",
            component: () => import("@/views/application/link/carrierLinkMaterialBatch"),
            meta: {
              title: "托盘绑定条码",
              language: 'CarrierLinkMaterialBatch',
              permissions: [],
            }
          },
          {
            path: "toolingLinkTooling",
            name: "ToolingLinkTooling",
            component: () => import("@/views/application/link/toolingLinkTooling"),
            meta: {
              title: "治具关联治具",
              language: 'ToolingLinkTooling',
              permissions: [],
            }
          },
          {
            path: "snLinkBatch",
            name: "SNLinkBatch",
            component: () => import("@/views/application/link/snLinkBatch"),
            meta: {
              title: "序列号关联批次号",
              language: 'SNLinkBatch',
              permissions: [],
            }
          },
          {
            path: "snLinkUPC",
            name: "SNLinkUPC",
            component: () => import("@/views/application/link/snLinkUPC"),
            meta: {
              title: "序列号关联UPC",
              language: 'SNLinkUPC',
              permissions: [],
            }
          }
        ]
      },
      {
        path: "material",
        name: "Material",
        component: () => import("@/views/application"),
        meta: {
          title: "物料",
          language: 'Material',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "materialInit",
            name: "MaterialInit",
            component: () => import("@/views/application/material/materialInit/index.vue"),
            meta: {
              title: "物料初始化",
              language: 'MaterialInit',
              permissions: [],
            }
          },
          {
            path: "materialCutting",
            name: "MaterialCutting",
            component: () => import("@/views/application/material/materialCutting/index.vue"),
            meta: {
              title: "物料切割SN",
              language: 'MaterialCutting',
              permissions: [],
            }
          },
          {
            path: "materialCuttingNoLine",
            name: "MaterialCuttingNoLine",
            component: () => import("@/views/application/material/materialCutting_SN_NoLine/index.vue"),
            meta: {
              title: "物料切割SN-NoLine",
              language: 'MaterialCuttingNoLine',
              permissions: [],
            }
          },
          {
            path: "materialCuttingDOE",
            name: "MaterialCuttingDOE",
            component: () => import("@/views/application/material/materialCutting_SN_DOE/index.vue"),
            meta: {
              title: "物料切割SN-DOE",
              language: 'MaterialCuttingDOE',
              permissions: [],
            }
          },
          {
            path: "batchCutting",
            name: "BatchCutting",
            component: () => import("@/views/application/material/batchCutting/index.vue"),
            meta: {
              title: "批次切割",
              language: 'BatchCutting',
              permissions: [],
            }
          },
        ]
      },
      {
        path: "other",
        name: "Other",
        component: () => import("@/views/application"),
        meta: {
          title: "其它",
          language: 'Other',
          permissions: [],
        },
        alwaysShow: true,
        children: [
          {
            path: "jumpStation",
            name: "JumpStation",
            component: () => import("@/views/application/other/jumpStation/index.vue"),
            meta: {
              title: "跳站",
              language: 'JumpStation',
              permissions: [],
            }
          },
          {
            path: "changePOAndPN",
            name: "ChangePOAndPN",
            component: () => import("@/views/application/other/changePOAndPN/index.vue"),
            meta: {
              title: "改变料号和工单",
              language: 'ChangePOAndPN',
              permissions: [],
            }
          },
          {
            path: "rework",
            name: "Rework",
            component: () => import("@/views/application/other/rework/index.vue"),
            meta: {
              title: "组装解绑",
              language: 'Rework',
              permissions: [],
            }
          },
        ]
      },
    ],
  },
  {
    path: '/function',
    component: Layout,
    name: 'Function',
    alwaysShow: true,
    meta: { title: '功能展示', icon: 'grip-lines', language: 'FunctionShow', permissions: [] },
    redirect: 'icon',
    isHidden: false,
    children: [
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/test/index'),
        meta: { title: '测试', permissions: [] },
      },
      {
        path: 'organization',
        name: 'Organization',
        component: () => import('@/views/vab/organizationChart/index.vue'),
        meta: { title: '组织架构图', permissions: [] },
      },
      {
        path: 'ScanQRCode',
        name: 'ScanQRCode',
        component: () => import('@/views/vab/ScanQRCode/index'),
        meta: { title: '二维码扫描', permissions: [] },
      },
      {
        path: 'apiTest',
        name: 'ApiTest',
        component: () => import('@/views/test/apiTest'),
        meta: { title: 'api测试', permissions: [] },
      },
      {
        path: 'icon',
        // component: EmptyLayout,
        component: Layout,
        redirect: 'awesomeIcon',
        name: 'Icon',
        meta: {
          title: '图标',
          permissions: [],
        },
        children: [
          {
            path: 'awesomeIcon',
            name: 'AwesomeIcon',
            component: () => import('@/views/vab/icon/index'),
            meta: { title: '常规图标', permissions: [] },
          },
          /*   {
              path: 'colorfulIcon',
              name: 'ColorfulIcon',
              component: () => import('@/views/vab/icon/colorfulIcon'),
              meta: { title: '多彩图标', permissions: [] },
            }, */
        ],
      },
      {
        path: 'table',
        component: () => import('@/views/vab/table/index'),
        name: 'Table',
        meta: {
          title: '表格',
          permissions: [],
        },
      },
      {
        path: 'map',
        component: () => import('@/views/vab/map/index'),
        name: 'Map',
        meta: {
          title: '地图',
          permissions: [],
        },
      },

      {
        path: 'webSocket',
        name: 'WebSocket',
        component: () => import('@/views/vab/webSocket/index'),
        meta: { title: 'webSocket', permissions: [] },
      },
      {
        path: 'form',
        name: 'Form',
        component: () => import('@/views/vab/form/index'),
        meta: { title: '表单', permissions: [] },
      },
      {
        path: 'element',
        name: 'Element',
        component: () => import('@/views/vab/element/index'),
        meta: { title: '常用组件', permissions: [] },
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/vab/tree/index'),
        meta: { title: '树', permissions: [] },
      },
      {
        path: 'verify',
        name: 'Verify',
        component: () => import('@/views/vab/verify/index'),
        meta: { title: '验证码', permissions: [] },
      },
      {
        path: 'magnifier',
        name: 'Magnifier',
        component: () => import('@/views/vab/magnifier/index'),
        meta: { title: '放大镜', permissions: [] },
      },
      {
        path: 'loading',
        name: 'Loading',
        component: () => import('@/views/vab/loading/index'),
        meta: { title: 'loading', permissions: [] },
      },
      {
        path: 'player',
        name: 'Player',
        component: () => import('@/views/vab/player/index'),
        meta: { title: '视频播放器', permissions: [] },
      },
      {
        path: 'markdownEditor',
        name: 'MarkdownEditor',
        component: () => import('@/views/vab/markdownEditor/index'),
        meta: { title: 'markdown编辑器', permissions: [] },
      },
      {
        path: 'editor',
        name: 'Editor',
        component: () => import('@/views/vab/editor/index'),
        meta: {
          title: '富文本编辑器',
          permissions: [],
          badge: 'New',
        },
      },
      {
        path: 'backToTop',
        name: 'BackToTop',
        component: () => import('@/views/vab/backToTop/index'),
        meta: { title: '返回顶部', permissions: [] },
      },
      {
        path: 'lodash',
        name: 'Lodash',
        component: () => import('@/views/vab/lodash/index'),
        meta: { title: 'lodash', permissions: [] },
      },
      {
        path: 'smallComponents',
        name: 'SmallComponents',
        component: () => import('@/views/vab/smallComponents/index'),
        meta: { title: '小组件', permissions: [] },
      },

      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/views/vab/upload/index'),
        meta: { title: '上传', permissions: [] },
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/vab/errorLog/index'),
        meta: { title: '错误日志模拟', permissions: [] },
      },
      {
        path: '',
        name: 'ExternalLink',
        meta: {
          title: '外链',
          target: '_blank',
          permissions: [],
          badge: 'New',
        },
      },
    ],
  },

  {
    path: '/usercenter',
    component: Layout,
    redirect: 'userInfoPage',
    name: 'UserCenter',
    meta: { title: '个人中心', icon: 'user', language: 'UserCenter' },
    isHidden: true,
    alwaysShow: true,
    children: [
      {
        path: 'userInfoPage',
        name: 'UserInfoPage',
        component: () => import("@/views/userCenter/index.vue"),
        meta: {
          title: '个人信息',
          language: 'UserInfoPage',
        }
      },
      {
        path: 'modifyPage',
        name: 'ModifyPage',
        component: () => import("@/views/userCenter/modify.vue"),
        meta: {
          title: '修改密码',
          language: 'ModifyPage',
        }
      },
      {
        path: 'problemFeedback',
        name: 'ProblemFeedback',
        isHidden: true,
        component: () => import("@/views/userCenter/problem"),
        meta: {
          title: '问题反馈',
          language: 'problemFeedback',
        }
      },
      {
        path: 'problemDetails',
        name: 'ProblemDetails',
        isHidden: true,
        component: () => import("@/views/userCenter/problem/details.vue"),
        meta: {
          title: '问题详情',
          language: 'ProblemDetails',
        }
      },
    ]
  },
  {
    path: '/configManagement',
    component: Layout,
    redirect: 'stationConfigPage',
    name: 'ConfigManagement',
    alwaysShow: true,
    isHidden: GlobalConfig.isReportServer,
    meta: { title: '配置管理', icon: 'cog', language: 'ConfigManagement', permissions: [], noKeepAlive: false },
    children: [
      {
        path: 'lineAndStation',
        name: 'LineAndStation',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '线别工站',
          language: 'LineAndStation',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'lineManagement',
            name: 'LineManagement',
            alwaysShow: false,
            component: () => import("@/views/configManagement/lineAndStation/line"),
            meta: {
              title: '线别管理',
              language: 'LineManagement',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'lineGroup',
            name: 'LineGroup',
            alwaysShow: false,
            component: () => import("@/views/configManagement/lineAndStation/lineGroup"),
            meta: {
              title: '线别分组',
              language: 'LineGroup',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'stationType',
            name: 'StationType',
            alwaysShow: false,
            component: () => import("@/views/configManagement/lineAndStation/stationType"),
            meta: {
              title: '工站类型',
              language: 'StationType',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'stationManagement',
            name: 'StationManagement',
            alwaysShow: false,
            component: () => import("@/views/configManagement/lineAndStation/station"),
            meta: {
              title: '工站管理',
              language: 'StationManagement',
              permissions: [],
              noKeepAlive: false
            }
          },
        ]
      },
      {
        path: 'materialManage',
        name: 'MaterialManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '物料管理',
          language: 'MaterialManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'partFamilyType',
            name: 'PartFamilyType',
            alwaysShow: false,
            component: () => import("@/views/configManagement/materialManage/partFamilyType"),
            meta: {
              title: '料号组类别',
              language: 'PartFamilyType',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'partFamily',
            name: 'PartFamily',
            alwaysShow: false,
            component: () => import("@/views/configManagement/materialManage/partFamily"),
            meta: {
              title: '料号组',
              language: 'PartFamily',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'part',
            name: 'Part',
            alwaysShow: false,
            component: () => import("@/views/configManagement/materialManage/part"),
            meta: {
              title: '料号',
              language: 'Part',
              permissions: [],
              noKeepAlive: false
            }
          },
          /*  {
             path: 'partAttribute',
             name: 'PartAttribute',
             alwaysShow: false,
             component: () => import("@/views/configManagement/materialManage/partAttribute"),
             meta: {
               title: '料号属性',
               language: 'PartAttribute',
               permissions: [],
               noKeepAlive: false
             }
           }, */
          {
            path: 'vendor',
            name: 'Vendor',
            alwaysShow: false,
            component: () => import("@/views/configManagement/materialManage/vendor"),
            meta: {
              title: '供应商',
              language: 'Vendor',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'defectCode',
            name: 'DefectCode',
            alwaysShow: false,
            component: () => import("@/views/configManagement/materialManage/defectCode"),
            meta: {
              title: '不良代码',
              language: 'DefectCode',
              permissions: [],
              noKeepAlive: false
            }
          },
        ]
      },
      {
        path: 'BOMManage',
        name: 'BOMManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: 'BOM管理',
          language: 'BOMManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'BOMProductStructure',
            name: 'BOMProductStructure',
            alwaysShow: false,
            component: () => import("@/views/configManagement/BOMManage/BOMProductStructure"),
            meta: {
              title: 'BOM产品结构',
              language: 'BOMProductStructure',
              permissions: [],
              noKeepAlive: false
            }
          },
        ]
      },
      {
        path: 'workflowManage',
        name: 'WorkflowManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '工艺流程管理',
          language: 'WorkflowManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'workflowName',
            name: 'WorkflowName',
            alwaysShow: false,
            component: () => import("@/views/configManagement/workflowManage/workflowName"),
            meta: {
              title: '工艺流程名',
              language: 'WorkflowName',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'workflowConfig',
            name: 'WorkflowConfig',
            alwaysShow: false,
            component: () => import("@/views/configManagement/workflowManage/workflowConfig"),
            meta: {
              title: '工艺流程配置',
              language: 'WorkflowConfig',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'workflowAllot',
            name: 'WorkflowAllot',
            alwaysShow: false,
            component: () => import("@/views/configManagement/workflowManage/workflowAllot"),
            meta: {
              title: '工艺流程分配',
              language: 'WorkflowAllot',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'workStageState',
            name: 'WorkStageState',
            alwaysShow: false,
            component: () => import("@/views/configManagement/workflowManage/workStageState"),
            meta: {
              title: '工序状态',
              language: 'WorkStageState',
              permissions: [],
              noKeepAlive: false
            }
          }
        ]
      },
      {
        path: 'WOManage',
        name: 'WorkOrderManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '工单管理',
          language: 'WorkOrderManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'WOMaintenance',
            name: 'WorkOrderMaintenance',
            alwaysShow: false,
            component: () => import("@/views/configManagement/workOrderManage/workOrderMaintenance"),
            meta: {
              title: '工单维护',
              language: 'WorkOrderMaintenance',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'PMCWOMaintenance',
            name: 'PMCWorkOrderMaintenance',
            alwaysShow: false,
            component: () => import("@/views/configManagement/workOrderManage/PMCWorkOrderMaintenance"),
            meta: {
              title: 'PMC工单维护',
              language: 'PMCWorkOrderMaintenance',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'workOrderAttribute',
            name: 'WorkOrderAttribute',
            alwaysShow: false,
            component: () => import("@/views/configManagement/workOrderManage/workOrderAttribute"),
            meta: {
              title: '工单属性',
              language: 'WorkOrderAttribute',
              permissions: [],
              noKeepAlive: false
            }
          },
        ]
      },
      {
        path: 'deviceManage',
        name: 'DeviceManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '设备管理',
          language: 'DeviceManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'deviceFamilyType',
            name: 'DeviceFamilyType',
            alwaysShow: false,
            component: () => import("@/views/configManagement/deviceManage/deviceFamilyType"),
            meta: {
              title: '设备组类别',
              language: 'DeviceFamilyType',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'deviceFamily',
            name: 'DeviceFamily',
            alwaysShow: false,
            component: () => import("@/views/configManagement/deviceManage/deviceFamily"),
            meta: {
              title: '设备组',
              language: 'DeviceFamily',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'deviceData',
            name: 'DeviceData',
            alwaysShow: false,
            component: () => import("@/views/configManagement/deviceManage/deviceData"),
            meta: {
              title: '设备资料',
              language: 'DeviceData',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'deviceAllot',
            name: 'DeviceAllot',
            alwaysShow: false,
            component: () => import("@/views/configManagement/deviceManage/deviceAllot"),
            meta: {
              title: '设备分配',
              language: 'DeviceAllot',
              permissions: [],
              noKeepAlive: false
            }
          },
        ]
      },
      {
        path: 'SNManage',
        name: 'SNManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '条码管理',
          language: 'SNManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'SNFamily',
            name: 'SNFamily',
            alwaysShow: false,
            component: () => import("@/views/configManagement/SNManage/SNFamily"),
            meta: {
              title: '条码分组',
              language: 'SNFamily',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'SNType',
            name: 'SNType',
            alwaysShow: false,
            component: () => import("@/views/configManagement/SNManage/SNType"),
            meta: {
              title: '条码类别',
              language: 'SNType',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'SNFormat',
            name: 'SNFormat',
            alwaysShow: false,
            component: () => import("@/views/configManagement/SNManage/SNFormat"),
            meta: {
              title: '条码格式',
              language: 'SNFormat',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'SNFormatAllot',
            name: 'SNFormatAllot',
            alwaysShow: false,
            component: () => import("@/views/configManagement/SNManage/SNFormatAllot"),
            meta: {
              title: '条码格式分配',
              language: 'SNFormatAllot',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'SNLockAndUnlock',
            name: 'SNLockAndUnlock',
            alwaysShow: false,
            component: () => import("@/views/configManagement/SNManage/SNLockAndUnlock"),
            meta: {
              title: '条码锁定与解锁',
              language: 'SNLockAndUnlock',
              permissions: [],
              noKeepAlive: false
            }
          }
        ]
      },
      {
        path: 'labelManage',
        name: 'LabelManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '标签管理',
          language: 'LabelManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'labelFamily',
            name: 'LabelFamily',
            alwaysShow: false,
            component: () => import("@/views/configManagement/labelManage/labelFamily"),
            meta: {
              title: '标签分组',
              language: 'LabelFamily',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'label',
            name: 'Label',
            alwaysShow: false,
            component: () => import("@/views/configManagement/labelManage/label"),
            meta: {
              title: '标签',
              language: 'Label',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'labelAllot',
            name: 'LabelAllot',
            alwaysShow: false,
            component: () => import("@/views/configManagement/labelManage/labelAllot"),
            meta: {
              title: '标签格式',
              language: 'LabelAllot',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'labelFieldDefinition',
            name: 'LabelFieldDefinition',
            alwaysShow: false,
            component: () => import("@/views/configManagement/labelManage/labelFieldDefinition"),
            meta: {
              title: '标签字段定义',
              language: 'LabelFieldDefinition',
              permissions: [],
              noKeepAlive: false
            }
          }
        ]
      },
      {
        path: 'attributeManage',
        name: 'AttributeManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '属性管理',
          language: 'AttributeManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'attributeConfig',
            name: 'AttributeConfig',
            alwaysShow: false,
            component: () => import("@/views/configManagement/attributeManage/attributeConfig"),
            meta: {
              title: '属性配置',
              language: 'AttributeConfig',
              permissions: [],
              noKeepAlive: false
            }
          },
        ]
      },
      {
        path: 'employeeManage',
        name: 'EmployeeManage',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '员工管理',
          language: 'EmployeeManage',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'userManage',
            name: 'UserManage',
            alwaysShow: false,
            component: () => import("@/views/configManagement/employeeManage/userManage"),
            meta: {
              title: '用户管理',
              language: 'UserManage',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'employeeAccess',
            name: 'EmployeeAccess',
            alwaysShow: false,
            component: () => import("@/views/configManagement/employeeManage/employeeAccess"),
            meta: {
              title: '员工权限',
              language: 'EmployeeAccess',
              permissions: [],
              noKeepAlive: false
            }
          },
        ]
      },
      {
        path: 'factoryCalendar',
        name: 'FactoryCalendar',
        alwaysShow: true,
        component: () => import("@/views/configManagement/index.vue"),
        meta: {
          title: '工厂日历',
          language: 'FactoryCalendar',
          permissions: [],
          noKeepAlive: false,
        },
        children: [
          {
            path: 'shift',
            name: 'Shift',
            alwaysShow: false,
            component: () => import("@/views/configManagement/factoryCalendar/shift"),
            meta: {
              title: '班次',
              language: 'Shift',
              permissions: [],
              noKeepAlive: false
            }
          },
          {
            path: 'calendar',
            name: 'Calendar',
            alwaysShow: false,
            component: () => import("@/views/configManagement/factoryCalendar/calendar"),
            meta: {
              title: '日历',
              language: 'Calendar',
              permissions: [],
              noKeepAlive: false
            }
          },
        ]
      },
      {
        path: 'stationConfigPage',
        name: 'StationConfigPage',
        alwaysShow: false,
        component: () => import("@/views/configManagement/stationConfig/index.vue"),
        meta: {
          title: '工站配置',
          language: 'StationConfigPage',
          permissions: [],
          noKeepAlive: true
        }
      },
      {
        path: 'comConfig',
        name: 'ComConfig',
        alwaysShow: false,
        component: () => import("@/views/configManagement/comConfig/index.vue"),
        meta: {
          title: '串口调式配置',
          language: 'ComConfig',
          permissions: [],
          noKeepAlive: false
        }
      },
      {
        path: 'bundledSoftware',
        name: 'BundledSoftware',
        component: () => import('@/views/configManagement/bundledSoftware'),
        meta: { title: '配套软件', language: 'BundledSoftware',/* badge: 'New', */ permissions: [], },
      },
    ]
  },
  {
    path: '/systemManagement',
    component: Layout,
    redirect: 'dictionaryConfig',
    name: 'SystemManagement',
    alwaysShow: true,
    meta: { title: '系统管理', icon: 'user-lock', language: 'SystemManagement', permissions: [] },
    children: [
      {
        path: 'timedTask',
        component: () => import('@/views/systemManagement/index.vue'),
        // redirect: 'noRedirect',
        name: 'TimedTask',
        alwaysShow: true,
        meta: { title: '定时任务', /* icon: 'user-clock', */ language: 'TimedTask' },
        children: [
          {
            path: 'taskList',
            name: 'TaskList',
            component: () => import("@/views/systemManagement/taskmanager/index.vue"),
            meta: {
              title: '任务列表',
              language: 'TaskList',
            }
          },
          {
            path: 'taskLog',
            name: 'TaskLog',
            component: () => import("@/views/systemManagement/taskmanager/log.vue"),
            meta: {
              title: '任务日志',
              language: 'TaskLog',
            }
          },
        ]
      },
      {
        path: 'developer',
        name: 'Developer',
        component: () => import('@/views/systemManagement/index.vue'),
        require: 'systemType',
        alwaysShow: true,
        meta: { title: '开发者', /* icon: 'users-cog', */ language: 'Developer', permissions: [] },
        children: [
          {
            path: 'systemType',
            name: 'SystemType',
            component: () => import('@/views/developer/systemtype'),
            meta: { title: '系统类型', language: 'SystemType', permissions: [] }
          },
          {
            path: 'app',
            name: 'APP',
            component: () => import('@/views/developer/app'),
            meta: { title: '应用管理', language: 'APP', permissions: [] }
          },
          {
            path: 'dbConnect',
            name: 'DbConnect',
            component: () => import('@/views/developer/tool'),
            meta: { title: '数据库连接', language: 'DbConnect', permissions: [] }
          },
        ]
      },
      {
        path: 'log',
        name: 'Log',
        component: () => import('@/views/systemManagement/index.vue'),
        require: 'logOperation',
        alwaysShow: true,
        meta: { title: '日志管理', /* icon: 'file-alt', */ language: 'Log', permissions: [] },
        children: [
          {
            path: 'loginLog',
            name: 'LoginLog',
            component: () => import('@/views/syslog/loginLog'),
            meta: { title: '登录日志', language: 'LoginLog', permissions: [] }
          },
          {
            path: 'logOperation',
            name: 'LogOperation',
            component: () => import('@/views/syslog'),
            meta: { title: '操作日志', language: 'LogOperation', permissions: [] }
          },
          {
            path: 'logException',
            name: 'LogException',
            component: () => import('@/views/syslog/exception.vue'),
            meta: { title: '异常日志', language: 'LogException', permissions: [] }
          },
          {
            path: 'logSQL',
            name: 'LogSQL',
            component: () => import('@/views/developer/tool'),
            meta: { title: 'sql日志', language: 'LogSQL', permissions: [] }
          },
        ]

      },
      {
        path: "dictionaryConfig",
        name: "DictionaryConfig",
        component: () => import("@/views/systemManagement/dictionary/index"),
        meta: {
          title: "字典配置",
          // icon: "dictionary-config-icon",
          language: 'DictionaryConfig',
          permissions: [],
        },
      },
      {
        path: 'userManagement',
        name: 'UserManagement',
        component: () =>
          import('@/views/systemManagement/userManagement/index'),
        meta: { title: '用户管理', language: 'UserManagement', permissions: [] },
      },
      {
        path: 'roleManagement',
        name: 'RoleManagement',
        component: () =>
          import('@/views/systemManagement/roleManagement/index'),
        meta: { title: '角色管理', language: 'RoleManagement', permissions: [], },
      },
      {
        path: 'menuManagement',
        name: 'MenuManagement',
        component: () =>
          import('@/views/systemManagement/menuManagement/index'),
        meta: { title: '菜单管理', language: 'MenuManagement',/* badge: 'New', */ permissions: [], },
      },
      {
        path: 'organize',
        name: 'Organize',
        component: () => import('@/views/systemManagement/organize'),
        meta: { title: '组织管理', language: 'Organize',/* badge: 'New', */ permissions: [], },
      },
      {
        path: 'filterip',
        name: 'FilterIP',
        component: () => import('@/views/systemManagement/filterip'),
        meta: { title: '访问控制', language: 'FilterIP',/* badge: 'New', */ permissions: [], },
      },
      {
        path: 'systemSetting',
        name: 'SystemSetting',
        component: () => import('@/views/systemManagement/setting'),
        meta: { title: '系统设置', language: 'SystemSetting',/* badge: 'New', */ permissions: [], },
      },
    ],
  },

  {
    path: '*',
    redirect: '/404',
    isHidden: true,
  },
]

// 处理遗留问题
asyncRoutes.forEach(res => {
  setFullPath(res)
})
function setFullPath(item, p) {
  let path = !p ? item.path : `${p === '/' ? '' : p}/${item.path}`;
  item['fullPath'] = path;
  if (item.children && item.children.length) {
    item.children.forEach(r => {
      setFullPath(r, path)
    })
  }
}


let router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
