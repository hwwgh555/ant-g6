// import G6 from '@antv/g6'
// import { fittingString, fittingStringEllipsis } from './util'
// import config from './config'

const node = () => {
    G6.registerNode(
        'custom-node',
        {
            draw(cfg, group) {
                const { 
                    nodeKey, 
                    branches, 
                    id, 
                    defaultBranch, 
                    desc, 
                    label,
                    branchText,
                } = cfg
                let isLongNode = branches?.length > 3
                let fs = fittingString(desc[0], isLongNode ? 120 + branches.length * 75 : 380, 14)
                let _desc = fs.res
                let descLineCount = fs.lineCount
                // 节点整体
                const mainGroup = group.addGroup({
                    id: `${nodeKey}-main-group`,
                    name: `${nodeKey}-main-group`,
                    capture: true,
                })
                const keyShape = mainGroup.addShape('rect', {
                    attrs: {
                        x: 0,
                        y: 0,
                        width: isLongNode ? 250 + branches.length * 75 : 510,
                        height: 190 + descLineCount * 10, // 这个计算没有完全看懂
                        radius: 4,
                        fill: config[nodeKey].bgColor,
                        lineWidth: 1,
                        stroke: config[nodeKey].borderColor,
                        shadowColor: config[nodeKey].shadowColor,
                        shadowBlur: 8,
                    },
                    capture: true,
                })
                // 节点上部
                const upGroup = group.addGroup({
                    id: `${nodeKey}-up-group`,
                    name: `${nodeKey}-up-group`,
                    capture: true,
                })
                // 节点关闭图标
                upGroup.addShape('image', {
                    attrs: {
                        x: 5,
                        y: 5,
                        cursor: 'pointer',
                    },
                    capture: true,
                    name: `${nodeKey}-node-close-icon`
                })
                // 分支图标
                upGroup.addShape('image', {
                    attrs: {
                        x: 40,
                        y: 30,
                        img: config[nodeKey].icon,
                    },
                    capture: true,
                })
                // 分支名称
                upGroup.addShape('text', {
                    attrs: {
                        text: label,
                        x: 90,
                        y: 50,
                        fill: '#585857',
                        fontSize: 16,
                        cursor: 'pointer',
                    },
                    capture: true,
                    name: `${nodeKey}-${id}-up-text`
                })
                // 引导话术
                upGroup.addShape('text', {
                    attrs: {
                        text: _desc,
                        x: 90,
                        y: 80 + descLineCount * 12, // 这里为什么是12，而上面是10呢？
                        fill: '#585857',
                        fontSize: 14,
                        cursor: 'pointer',
                    },
                    capture: true,
                    name: `${nodeKey}-${id}-up-text`
                })
                // 分割线
                upGroup.addShape('rect', {
                    attrs: {
                        x: 0,
                        y: 120 + descLineCount * 10,
                        width: isLongNode ? 250 + branches.length * 75 : 510,
                        height: 2,
                        fill: config[nodeKey].borderColor,
                        shadowColor: config[nodeKey].shadowColor,
                        shadowBlur: 8,
                    },
                    capture: true,
                })
                // 节点下部
                const downGroup = group.addGroup({
                    id: `${nodeKey}-down-group`,
                    name: `${nodeKey}-down-group`,
                    capture: true,
                })
                downGroup.addShape('text', {
                    attrs: {
                        text: branchText,
                        x: 18,
                        y: 165 + descLineCount * 10,
                        fill: '#585857',
                        fontSize: 14,
                    },
                    capture: true,
                })
                // 创建分支shape
                if (branches) {
                    branches.forEach((itm, idx) => {
                        // 分支外框
                        downGroup.addShape('rect', {
                            attrs: {
                                x: (95 + idx * 75),
                                y: 147 + descLineCount * 10,
                                width: 64,
                                height: 24,
                                radius: 1,
                                fill: '#fff',
                                stroke: '#1FCDCF',
                                cursor: 'pointer',
                            },
                            capture: true,
                            name: `${nodeKey}-${id}-${itm.id}-branch-name`
                        })
                        // 分支文字
                        downGroup.addShape('text', {
                            attrs: {
                                x: (103 + idx * 75),
                                y: 165 + descLineCount * 10,
                                text: fittingStringEllipsis(itm.name, 60, 12),
                                fill: '#1FCDCF',
                                fontSize: 12,
                                cursor: 'pointer',
                            },
                            capture: true,
                            name: `${nodeKey}-${id}-${itm.id}-branch-name`
                        })
                        // 分支关闭图标
                        downGroup.addShape('image', {
                            attrs: {
                                x: (150 + idx * 75),
                                y: 140 + descLineCount * 10,
                                // img: config.common.closeIcon,
                                cursor: 'pointer',
                            },
                            capture: true,
                            name: `${nodeKey}-${id}-${itm.id}-branch-close-icon`
                        })
                    })
                }
                // 分支添加图标
                downGroup.addShape('image', {
                    attrs: {
                        x: (95 + (branches?.length || 0) * 75),
                        y: 150 + descLineCount * 10,
                        img: config.common.addIcon,
                        cursor: 'pointer',
                    },
                    capture: true,
                    name: `${nodeKey}-${id}-add-icon`
                })
                // 默认分支外框
                downGroup.addShape('rect', {
                    attrs: {
                        x: (isLongNode ? 177 + branches.length * 75 : 439),
                        y: 147 + descLineCount * 10,
                        width: 64,
                        height: 24,
                        radius: 1,
                        fill: '#fff',
                        stroke: '#1FCDCF',
                        cursor: 'pointer',
                    },
                    capture: true,
                    name: `${nodeKey}-${id}-default-branch-name`
                })
                // 默认分支文字
                downGroup.addShape('text', {
                    attrs: {
                        x: (isLongNode ? 185 + branches.length * 75 : 448),
                        y: 165 + descLineCount * 10,
                        text: defaultBranch?.name,
                        fill: '#1FCDCF',
                        fontSize: 12,
                        cursor: 'pointer',
                    },
                    capture: true,
                    name: `${nodeKey}-${id}-default-branch-name`
                })

                return keyShape
            },

            afterDraw(cfg, group) {
                // 节点关闭icon
                const nodeCloseIcon = group.find(element => element.get('name')?.includes('node-close-icon'))
                // 分支关闭rect
                const branchCloseRects = group.findAll(element => element.get('name')?.includes('branch-name') && !element.get('name')?.includes('default-branch-name'))
                // 分支关闭icon
                const branchCloseIcons = group.findAll(element => element.get('name')?.includes('branch-close-icon'))
                // 节点关闭按钮hover
                group.on('mouseenter', () => {
                    // 这个api从哪儿看到的？
                    nodeCloseIcon.attr('img', config.common.closeIconLight)
                })
                group.on('mouseleave', () => {
                    nodeCloseIcon.attr('img', null)
                })

                nodeCloseIcon.on('mouseenter', () => {
                    nodeCloseIcon.attr('img', config.common.closeIcon)
                })
                nodeCloseIcon.on('mouseleave', () => {
                    nodeCloseIcon.attr('img', config.common.closeIconLight)
                })

                branchCloseRects.forEach(i => {
                    i.on('mouseenter', () => {
                        const activeCloseIconName = i.get('name').replace('name', 'close-icon')
                        console.log({activeCloseIconName})
                        const branchCloseIcon = group.find(element => element.get('name') === activeCloseIconName)
                        branchCloseIcon.attr('img', config.common.closeIconLight)
                    })
                })
                branchCloseRects.forEach(i => {
                    i.on('mouseleave', () => {
                        const activeCloseIconName = i.get('name').replace('name', 'close-icon')
                        const branchCloseIcon = group.find(element => element.get('name') === activeCloseIconName)
                        branchCloseIcon.attr('img', null)
                    })
                })
                branchCloseIcons.forEach(i => {
                    i.on('mouseenter', () => {
                        i.attr('img', config.common.closeIcon)
                    })
                })
                branchCloseIcons.forEach(i => {
                    i.on('mouseleave', () => {
                        i.attr('img', null)
                    })
                })
            },

            update(cfg, node) {},

            afterUpdate(cfg, node) {},

            setState(name, value, node) {},

            getAnchorPoints(cfg) {
                const { branches } = cfg
                let isLongNode = branches.length > 3
                if (isLongNode) {
                    let t = branches.length
                    let pointArr = branches.map((itm, idx) => {
                        return [
                            (95 + 65 * idx + 10 * idx + 65 / 2) / (250 + (t * 75))
                            , 1
                        ]
                    });
                    // 默认分支固定index = 4
                    pointArr.splice(
                        3, 0,
                        // 默认分支
                        [
                            (210 + t * 75) / (250 + (t * 75))
                            , 1
                        ]
                    )
                    return [
                        // 顶部中间
                        [0.5, 0],
                        // 底部分支
                        ...pointArr
                    ]
                } else {
                    return [
                        // 顶部中间
                        [0.5, 0],
                        // 底部分支
                        [0.25, 1],
                        [0.4, 1],
                        [0.55, 1],
                        // 默认分支
                        [0.92, 1],
                    ]
                }
            },
        },
    );
}