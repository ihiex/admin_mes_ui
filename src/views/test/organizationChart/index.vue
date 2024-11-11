<template>
  <div class="org_chart">
    <div id="MyOverviewDiv"></div>
    <div class="search">
      <el-input ref="searchRef" v-model="value" placeholder="Enter key words" class="input-with-select"
        style="width: 275px; margin-bottom: 5px" clearable @keypress.native.enter="searchDiagram(value)"
        @clear="searchDiagram(value)">
        <el-button slot="append" icon="el-icon-search" @click="searchDiagram(value)"></el-button>
      </el-input>
      <el-button @click="handleZoomToFit">Zoom to fit</el-button>
      <el-button @click="handleCenterOnRoot">Center on root</el-button>
      <el-button type="primary" @click="handleSave">Save</el-button>
    </div>
    <div id="MyDiagramDiv"></div>
    <Drawer ref="DrawerRef" @confirm="updateData"></Drawer>
  </div>
</template>

<script>
import data from './data';
import Drawer from './drawer.vue'

export default {
  name: 'OrganizationChart',
  components: {
    Drawer
  },
  data() {
    return {
      // $$: go.GraphObject.make,
      myDiagram: null,
      myOverview: null,
      value: '',
      cacheData: null
    }
  },
  mounted() {

    this.init()
  },
  methods: {
    handleSave() {
      console.log(this.myDiagram.model.toJson())
      // this.load()
    },

    init() {
      const $ = go.GraphObject.make;
      let that = this;

      that.myDiagram = new go.Diagram("MyDiagramDiv", // must be the ID or reference to div
        {
          allowCopy: false,
          allowDelete: false,
          //initialAutoScale: go.Diagram.Uniform,
          maxSelectionCount: 1, // users can select only one part at a time
          validCycle: go.Diagram.CycleDestinationTree, // make sure users can only create trees
          "clickCreatingTool.archetypeNodeData": { // allow double-click in background to create a new node
            name: "(new person)",
            title: "",
            comments: ""
          },
          "clickCreatingTool.insertPart": function (loc) {  // method override must be function, not =>
            const node = go.ClickCreatingTool.prototype.insertPart.call(this, loc);
            if (node !== null) {
              this.diagram.select(node);
              this.diagram.commandHandler.scrollToPart(node);
              this.diagram.commandHandler.editTextBlock(node.findObject("NAMETB"));
            }
            return node;
          },
          layout:
            $(go.TreeLayout,
              {
                treeStyle: go.TreeLayout.StyleLastParents,
                arrangement: go.TreeLayout.ArrangementHorizontal,
                // properties for most of the tree:
                angle: 90,
                layerSpacing: 35,
                // properties for the "last parents":
                alternateAngle: 90,
                alternateLayerSpacing: 35,
                alternateAlignment: go.TreeLayout.AlignmentBus,
                alternateNodeSpacing: 20
              }),
          "undoManager.isEnabled": true // enable undo & redo
        });


      that.myDiagram.addDiagramListener("Modified", e => {
        // 添加修改提示
        const idx = document.title.indexOf("*");
        if (that.myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.slice(0, idx);
        }
      });

      const levelColors = ["#AC193D", "#2672EC", "#8C0095", "#5133AB",
        "#008299", "#D24726", "#008A00", "#094AB2"];

      // override TreeLayout.commitNodes to also modify the background brush based on the tree depth level
      that.myDiagram.layout.commitNodes = function () {  // method override must be function, not =>
        go.TreeLayout.prototype.commitNodes.call(this);  // do the standard behavior
        // then go through all of the vertexes and set their corresponding node's Shape.fill
        // to a brush dependent on the TreeVertex.level value
        that.myDiagram.layout.network.vertexes.each(v => {
          if (v.node) {
            const level = v.level % (levelColors.length);
            const color = levelColors[level];
            const shape = v.node.findObject("SHAPE");
            if (shape) shape.stroke = $(go.Brush, "Linear", { 0: color, 1: go.Brush.lightenBy(color, 0.05), start: go.Spot.Left, end: go.Spot.Right });
          }
        });
      };

      // this is used to determine feedback during drags
      function mayWorkFor(node1, node2) {
        if (!(node1 instanceof go.Node)) return false;  // must be a Node
        if (node1 === node2) return false;  // cannot work for yourself
        if (node2.isInTreeOf(node1)) return false;  // cannot work for someone who works for you
        return true;
      }

      // This function provides a common style for most of the TextBlocks.
      // Some of these values may be overridden in a particular TextBlock.
      function textStyle() {
        return { font: "9pt  Segoe UI,sans-serif", stroke: "white" };
      }

      // This converter is used by the Picture.
      function findHeadShot(pic) {
        if (!pic) return require("./images/HSnopic.png"); // There are only 16 images on the server
        if (pic.includes('api')) {
          console.log(that.$baseUrl + pic)
          return pic
        }
        return require("./images/HS" + pic);
      }

      // define the Node template
      that.myDiagram.nodeTemplate =
        $(go.Node, "Spot",
          {
            selectionObjectName: "BODY",
            mouseEnter: (e, node) => node.findObject("BUTTON").opacity = node.findObject("BUTTONX").opacity = 1,
            mouseLeave: (e, node) => node.findObject("BUTTON").opacity = node.findObject("BUTTONX").opacity = 0,
            // handle dragging a Node onto a Node to (maybe) change the reporting relationship
            mouseDragEnter: (e, node, prev) => {
              const diagram = node.diagram;
              const selnode = diagram.selection.first();
              if (!mayWorkFor(selnode, node)) return;
              const shape = node.findObject("SHAPE");
              if (shape) {
                shape._prevFill = shape.fill;  // remember the original brush
                shape.fill = "darkred";
              }
            },
            mouseDragLeave: (e, node, next) => {
              const shape = node.findObject("SHAPE");
              if (shape && shape._prevFill) {
                shape.fill = shape._prevFill;  // restore the original brush
              }
            },
            mouseDrop: (e, node) => {
              const diagram = node.diagram;
              const selnode = diagram.selection.first();  // assume just one Node in selection
              if (mayWorkFor(selnode, node)) {
                // find any existing link into the selected node
                const link = selnode.findTreeParentLink();
                if (link !== null) {  // reconnect any existing link
                  link.fromNode = node;
                } else {  // else create a new link
                  diagram.toolManager.linkingTool.insertLink(node, node.port, selnode, selnode.port);
                }
              }
            }
          },
          // for sorting, have the Node.text be the data.name
          new go.Binding("text", "name"),
          // bind the Part.layerName to control the Node's layer depending on whether it isSelected
          new go.Binding("layerName", "isSelected", sel => sel ? "Foreground" : "").ofObject(),
          $(go.Panel, "Auto",
            { name: "BODY" },
            // define the node's outer shape
            $(go.Shape, "Rectangle",
              { name: "SHAPE", fill: "#333333", stroke: 'white', strokeWidth: 3.5, portId: "" },
              new go.Binding("fill", "isHighlighted", h => h ? "gold" : "#333333").ofObject() //配置搜索高亮使用
            ),
            $(go.Panel, "Horizontal",
              $(go.Picture,
                {
                  name: "Picture",
                  desiredSize: new go.Size(70, 70),
                  margin: 1.5,
                  source: require("./images/HSnopic.png")  // the default image
                },
                new go.Binding("source", "pic", findHeadShot)),
              // define the panel where the text will appear
              $(go.Panel, "Table",
                {
                  minSize: new go.Size(130, NaN),
                  maxSize: new go.Size(150, NaN),
                  margin: new go.Margin(6, 10, 0, 6),
                  defaultAlignment: go.Spot.Left
                },
                $(go.RowColumnDefinition, { column: 2, width: 4 }),
                $(go.TextBlock, textStyle(),  // the name
                  {
                    name: "NAMETB",
                    row: 0, column: 0, columnSpan: 5,
                    font: "12pt Segoe UI,sans-serif",
                    editable: true, isMultiline: false,
                    minSize: new go.Size(50, 16)
                  },
                  new go.Binding("text", "name").makeTwoWay()),
                $(go.TextBlock, "职位: ", textStyle(),
                  { row: 1, column: 0 }),
                $(go.TextBlock, textStyle(),
                  {
                    row: 1, column: 1, columnSpan: 4,
                    editable: true, isMultiline: false,
                    minSize: new go.Size(50, 14),
                    margin: new go.Margin(0, 0, 0, 3)
                  },
                  new go.Binding("text", "title").makeTwoWay()),
                /*   $(go.TextBlock, textStyle(),
                    { row: 2, column: 0 },
                    new go.Binding("text", "key", v => "ID: " + v)), */
                $(go.TextBlock, textStyle(),  // the comments
                  {
                    row: 3, column: 0, columnSpan: 5,
                    font: "italic 9pt sans-serif",
                    wrap: go.TextBlock.WrapFit,
                    editable: true,  // by default newlines are allowed
                    minSize: new go.Size(100, 14)
                  },
                  new go.Binding("text", "comments").makeTwoWay())
              ) // end Table Panel
            ) // end Horizontal Panel
          ), // end Auto Panel
          $("Button",
            $(go.Shape, "PlusLine", { width: 10, height: 10 }),
            {
              name: "BUTTON", alignment: go.Spot.Right, opacity: 0,  // initially not visible
              click: (e, button) => addEmployee(button.part)
            },
            // button is visible either when node is selected or on mouse-over
            new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
          ),
          new go.Binding("isTreeExpanded").makeTwoWay(),
          $("TreeExpanderButton",
            {
              name: "BUTTONX", alignment: go.Spot.Bottom, opacity: 0,  // initially not visible
              "_treeExpandedFigure": "TriangleUp",
              "_treeCollapsedFigure": "TriangleDown"
            },
            // button is visible either when node is selected or on mouse-over
            new go.Binding("opacity", "isSelected", s => s ? 1 : 0).ofObject()
          ),
          {

            doubleClick: (e, node) => {
              // if (that.isReadOnly) return;
              let item = node.part //that.myDiagram.selection.first()
              console.log(item.data)
              if (item) {
                this.cacheData = item
                that.$refs.DrawerRef.show(item.data)
              }
            }
          }
        );  // end Node, a Spot Panel


      function addEmployee(node) {
        if (!node) return;
        const thisemp = node.data;
        that.myDiagram.startTransaction("add employee");
        const newemp = { name: "(new person)", title: "(title)", comments: "", parent: thisemp.key };
        that.myDiagram.model.addNodeData(newemp);
        const newnode = that.myDiagram.findNodeForData(newemp);
        if (newnode) newnode.location = node.location;
        that.myDiagram.commitTransaction("add employee");
        that.myDiagram.commandHandler.scrollToPart(newnode);
      }

      // the context menu allows users to make a position vacant,
      // remove a role and reassign the subtree, or remove a department
      that.myDiagram.nodeTemplate.contextMenu =
        $("ContextMenu",
          $("ContextMenuButton",
            $(go.TextBlock, "Add Employee"),
            {
              click: (e, button) => addEmployee(button.part.adornedPart)
            }
          ),
          $("ContextMenuButton",
            $(go.TextBlock, "Vacate Position"),
            {
              click: (e, button) => {
                const node = button.part.adornedPart;
                if (node !== null) {
                  const thisemp = node.data;
                  that.myDiagram.startTransaction("vacate");
                  // update the key, name, picture, and comments, but leave the title
                  that.myDiagram.model.setDataProperty(thisemp, "name", "(Vacant)");
                  that.myDiagram.model.setDataProperty(thisemp, "pic", "");
                  that.myDiagram.model.setDataProperty(thisemp, "comments", "");
                  that.myDiagram.commitTransaction("vacate");
                }
              }
            }
          ),
          $("ContextMenuButton",
            $(go.TextBlock, "Remove Role"),
            {
              click: (e, button) => {
                // reparent the subtree to this node's boss, then remove the node
                const node = button.part.adornedPart;
                if (node !== null) {
                  that.myDiagram.startTransaction("reparent remove");
                  const chl = node.findTreeChildrenNodes();
                  // iterate through the children and set their parent key to our selected node's parent key
                  while (chl.next()) {
                    const emp = chl.value;
                    that.myDiagram.model.setParentKeyForNodeData(emp.data, node.findTreeParentNode().data.key);
                  }
                  // and now remove the selected node itself
                  that.myDiagram.model.removeNodeData(node.data);
                  that.myDiagram.commitTransaction("reparent remove");
                }
              }
            }
          ),
          $("ContextMenuButton",
            $(go.TextBlock, "Remove Department"),
            {
              click: (e, button) => {
                // remove the whole subtree, including the node itself
                const node = button.part.adornedPart;
                if (node !== null) {
                  that.myDiagram.startTransaction("remove dept");
                  that.myDiagram.removeParts(node.findTreeParts());
                  that.myDiagram.commitTransaction("remove dept");
                }
              }
            }
          )
        );


      // define the Link template, a simple orthogonal line
      that.myDiagram.linkTemplate =
        $(go.Link, go.Link.Orthogonal,
          { layerName: "Background", corner: 5 },
          $(go.Shape, { strokeWidth: 1.5, stroke: "#222" }));  // the link shape

      // Overview
      that.myOverview =
        new go.Overview("MyOverviewDiv",  // the HTML DIV element for the Overview
          { observed: that.myDiagram, contentAlignment: go.Spot.Center });   // tell it which Diagram to show and pan



      // support editing the properties of the selected person in HTML
      if (window.Inspector) myInspector = new Inspector("myInspector", that.myDiagram,
        {
          properties: {
            "key": { readOnly: true },
            "comments": {}
          }
        });
      that.load()
    },
    updateData(data) {
      var resData = this.cacheData.data;
      if (this.cacheData instanceof go.Node && resData !== null) {
        var model = this.myDiagram.model;
        Object.keys(data).forEach(key => {
          model.startTransaction("modified " + key);
          model.setDataProperty(resData, key, data[key]);
          model.commitTransaction("modified " + key);
        })
      }
    },
    handleCenterOnRoot() {
      this.myDiagram.commandHandler.zoomToFit()
    },
    handleZoomToFit() {
      this.myDiagram.scale = 1;
      this.myDiagram.commandHandler.scrollToPart(this.myDiagram.findNodeForKey(1));
    },
    load() {
      // create the Model with data for the tree, and assign to the Diagram
      this.myDiagram.model = go.Model.fromJson(data)
      // new go.TreeModel(
      //   {
      //     // nodeParentKeyProperty: "boss",  // this property refers to the parent node data
      //     nodeDataArray: data
      //   });

      let lastkey = 1;
      this.myDiagram.model.makeUniqueKeyFunction = (model, data) => {
        let k = data.key || lastkey;
        while (model.findNodeDataForKey(k)) k++;
        data.key = lastkey = k;
        return k;
      };
    },
    searchDiagram(value) {  // called by button
      // var input = document.getElementById("mySearch");
      let that = this
      // if (!input) return;
      that.myDiagram.focus();

      that.myDiagram.startTransaction("highlight search");

      if (value) {
        // search four different data properties for the string, any of which may match for success
        // create a case insensitive RegExp from what the user typed
        var safe = value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var regex = new RegExp(safe, "i");
        var results = that.myDiagram.findNodesByExample({ name: regex },
          { title: regex });
        console.log(results)
        that.myDiagram.highlightCollection(results);
        // try to center the diagram at the first node that was found
        if (results.count > 0) that.myDiagram.centerRect(results.first().actualBounds);
      } else {  // empty string only clears highlighteds collection
        that.myDiagram.clearHighlighteds();
      }

      that.myDiagram.commitTransaction("highlight search");
      that.$refs.searchRef.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
.org_chart {
  height: inherit;
  position: relative;
  background-color: #fff;

  #MyOverviewDiv {
    position: absolute;
    bottom: 15px;
    right: 20px;
    border: 1px solid gold;
    width: 300px;
    height: 150px;
    z-index: 100;
    background-color: #fff;
  }

  #MyDiagramDiv {
    height: inherit;
    border: 1px solid #a0a0a0
  }

  .search {
    // border: 1px solid red;
    width: 280px;
    z-index: 100;
    background-color: #fafafa;
    padding: 5px;
    position: absolute;
    right: 20px;
    top: 10px;
  }
}
</style>
