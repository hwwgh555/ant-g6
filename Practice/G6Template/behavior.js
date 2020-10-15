const behavior = () => {
    // 点击添加边
    G6.registerBehavior('click-add-edge', {
        getEvents() {
            return {
                'node:dblclick': 'onClick',
                mousemove: 'onMousemove',
                'edge:click': 'onEdgeClick',
            };
        },
        onClick(ev) {
            const self = this;
            const node = ev.item; // ev.item 操作的目标元素； ev.target 当前对象 ？？
            const graph = self.graph;
            debugger
            // data中的中节点信息
            const model = node.getModel();
            const clickSourceName = ev.target.get('name')
            const longBranches = model.branches?.length > 3
            // 开始节点连线
            if (model.id === 'startNode') {
                if (self.addingEdge && self.edge) {
                    graph.updateItem(self.edge, {
                        target: model.id,
                        targetAnchor: 0,
                    });
            
                    self.edge = null;
                    self.addingEdge = false;
                } else {
                    // 判断点击的开始节点是否有连线
                    if (node.getEdges().length) {
                        console.log('已经有连线了');
                        return
                    }
                    self.edge = graph.addItem('edge', {
                        source: model.id,
                        target: model.id,
                    });
                    self.addingEdge = true;
                }
                return
            }
            // 其他节点分支连线
            if (self.addingEdge && self.edge) {
                graph.updateItem(self.edge, {
                    target: model.id,
                    targetAnchor: 0,
                });
        
                self.edge = null;
                self.addingEdge = false;
            } else {
                // 点击的branch在branches中的位置
                const _pointIndex = model.branches
                    ?.map(i => i.id)
                    .indexOf(clickSourceName?.split('-')[2]) + 1
                // 点击的branch在锚点列表中的位置
                const pointIndex = clickSourceName?.includes('default-branch-name') ? 
                    4 : 
                    (_pointIndex + (longBranches && _pointIndex > 3 && 1))
                if (!clickSourceName?.includes('branch-name')) {
                    return
                }
                // TODO: ??
                // 判断点击的branch是否有连线
                const flag = node
                    .getEdges()
                    .map(i => i.getModel())
                    .filter(i => i.source === node.get('id'))
                    .map(i => i.sourceAnchor)
                    .includes(pointIndex);
                if (flag) {
                    return
                }
                const sourceAnchor = clickSourceName?.includes('default-branch-name') ? 
                    // 默认分支固定锚点index = 4
                    4 : 
                    // 其他锚点如果分支数多需要跳过默认分支的锚点
                    pointIndex
                self.edge = graph.addItem('edge', {
                    source: model.id,
                    target: model.id,
                    sourceAnchor,
                });
                self.addingEdge = true;
            }
        },
        onMousemove(ev) {
            const self = this;
            const point = { x: ev.x, y: ev.y };
            if (self.addingEdge && self.edge) {
                self.graph.updateItem(self.edge, {
                    target: point,
                });
            }
        },
        onEdgeClick(ev) {
            const self = this;
            const currentEdge = ev.item;
            if (self.addingEdge && self.edge === currentEdge) {
                self.graph.removeItem(self.edge);
                self.edge = null;
                self.addingEdge = false;
            }
        },
    });
}