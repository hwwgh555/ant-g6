class G6Template {
    constructor(
        // 容器
        container,
        // 数据
        data,
        // 配置对象
        cfg,
        handleNodeClick,
    ) {
        this.container = container
        this.data = data
        this.cfg = cfg
        this.handleNodeClick = handleNodeClick
        this.graph = null
        this.init()
        this.bind()
        this.render()
        this.update()
    }

    init() {
        node()
        behavior()

        const minimap = new G6.Minimap({
          size: [100, 150],
          className: 'g6-minimap',
          type: 'delegate',
        });
        const toolbar = new G6.ToolBar({
            className: 'g6-toolbar-wrapper',
            getContent: () => {
                return `
                    <ul>
                        <li code="zoomOut" class="g6-toolbar-item zoomOut">
                            <img src=${config.common.zoomOut} />
                        </li>
                        <li code="zoomIn" class="g6-toolbar-item zoomIn">
                            <img src=${config.common.zoomIn} />
                        </li>
                        <li code="fullScreen" class="g6-toolbar-item fullScreen">
                            <img src=${config.common.fullScreen} />
                        </li>
                    </ul>
                `
            },
            handleClick: (code, graph) => {
                switch (code) {
                    case 'zoomOut':
                        graph.zoom(1.03)
                        break;
                
                    case 'zoomIn':
                        graph.zoom(0.97)
                        break;
                        
                    case 'fullScreen':
                        this.container.requestFullscreen()
                        break;
                                                        
                    default:
                        break;
                }
            }
        });

        if (!this.graph) {
            this.graph = new G6.Graph({
                container: this.container,
                width: this.cfg?.width ?? 1000,
                height: this.cfg?.height ?? 1000,
                // fitView: true,
                modes: {
                  default: [
                    'drag-node', 
                    'drag-canvas',
                    // 'click-select',
                    'zoom-canvas',
                    'click-add-edge',
                  ],
                },
                defaultNode: {
                  type: 'rect',
                },
                // 默认边样式
                defaultEdge: {
                    type: 'cubic',
                    style: {
                        stroke: '#BFC9D3',
                        lineWidth: 2,
                        lineAppendWidth: 5,
                        cursor: 'pointer',
                        endArrow: true,
                  }
                },
                // 节点在各状态下的样式
                nodeStateStyles: {
                 
                  hover: {},
                  // click 状态为 true 时的样式
                  click: {},
                },
                // 边在各状态下的样式
                edgeStateStyles: {
                   
                    hover: {
                        stroke: '#f0f',
                        lineWidth: 3,
                    },
                    // click 状态为 true 时的样式
                    click: {},
                },
                plugins: [
                    minimap,
                    toolbar,
                ],
            })
        }
    }

    render(newData) {
        if (!this.graph) {
            return
        }
        this.graph.read(newData || this.data);
    }

    bind() {
        if (!this.graph) {
          return
        }
        // 鼠标进入节点
        this.graph.on('edge:mouseenter', evt => {
            const { item } = evt
            this.graph.setItemState(item, 'hover', true)
        })
        // 鼠标离开节点
        this.graph.on('edge:mouseleave', evt => {
            const { item } = evt
            this.graph.setItemState(item, 'hover', false)
        })
        // 点击节点
        this.graph.on('node:click', (e) => {
            // 删除节点
            if (e.target.get('name')?.includes('node-close-icon')) {
                this.graph.removeItem(e.item, true)
            }
            this.handleNodeClick(e.target.get('name'), e.item)
            if (!e.target.get('name')) {
                return
            }
            // 先将所有当前是 click 状态的节点置为非 click 状态
            // const clickNodes = this.graph.findAllByState('node', 'click');
            // clickNodes.forEach((cn) => {
            //     this.graph.setItemState(cn, 'click', false);
            // });
            // const nodeItem = e.item; // 获取被点击的节点元素对象
            // this.graph.setItemState(nodeItem, 'click', true); // 设置当前节点的 click 状态为 true
        });
        // 点击边
        this.graph.on('edge:click', (e) => {
            // 删除边
            if (e.target.get('name')?.includes('edge-shape')) {
                this.graph.removeItem(e.item, true)
            }
            this.handleNodeClick(e.target.get('name'), e.item)
            if (!e.target.get('name')) {
                return
            }
            // // 先将所有当前是 click 状态的边置为非 click 状态
            // const clickEdges = this.graph.findAllByState('edge', 'click');
            // clickEdges.forEach((ce) => {
            //     this.graph.setItemState(ce, 'click', false);
            // });
            // const edgeItem = e.item; // 获取被点击的边元素对象
            // this.graph.setItemState(edgeItem, 'click', true); // 设置当前边的 click 状态为 true
        });
        // 点击combo
        // this.graph.on('combo:click', (e) => {})
        // 点击画布
        // this.graph.on('canvas: click', (e) => {})
    }

    update() {
        if (!this.graph) {
            return
        }
        return
        this.graph.update(this.graph.findById('node1'), {
          style: {
            fill: '#f00',
            stroke: '#0f0',
            lineWidth: 3,
            lineDash: [5, 3],
            shadowColor: '#00f',
            shadowBlur: 8,
            shadowOffsetX: 4,
            shadowOffsetY: 4,
            opacity: 0.5,
            fillOpacity: 0.3,
            cursor: 'pointer'
          }
        });
    }

    dragAddNode(e, cfg) {
      let point = this.graph.getPointByClient(e.clientX, e.clientY);
      this.graph.addItem("node", {
        x: parseInt(point.x),
        y: parseInt(point.y),
        ...cfg,
      });
    }

    save() {
        return this.graph.save()
    }
}