var json2GOJSD_InData = {
	"schema": {
		"name": "string",
		"age": "string",
		"sex": "string",
		"idcard": "string",
		"dob": "string",
		"contact": [
			{
				"name": "string",
				"age": "string",
				"profile": {
					"phone": "string",
					"idcard": [
						{
							"id": "string",
							"idobj": {
								"abc": "string"
							},
							"idarr": [
								{
									"hello": "string",
									"bye": "string"
								}
							]
						}
					]
				}
			}
		]
	},
	"keys": [
		{
			"key": "@In{name}"
		},
		{
			"key": "@In{age}"
		},
		{
			"key": "@In{sex}"
		},
		{
			"key": "@In{idcard}"
		},
		{
			"key": "@In{dob}"
		},
		{
			"key": "@In{contact}"
		},
		{
			"key": "@In{contact.name}"
		},
		{
			"key": "@In{contact.age}"
		},
		{
			"key": "@In{contact.profile}"
		},
		{
			"key": "@In{contact.profile.phone}"
		},
		{
			"key": "@In{contact.profile.idcard}"
		},
		{
			"key": "@In{contact.profile.idcard.id}"
		},
		{
			"key": "@In{contact.profile.idcard.idobj}"
		},
		{
			"key": "@In{contact.profile.idcard.idobj.abc}"
		},
		{
			"key": "@In{contact.profile.idcard.idobj.idarr}"
		},
		{
			"key": "@In{contact.profile.idcard.idobj.idarr.hello}"
		},
		{
			"key": "@In{contact.profile.idcard.idobj.idarr.bye}"
		}
	]
};
var json2GOJSD_OutData = {
	"schema": {
		"name": "string",
		"age": "string",
		"sex": "string",
		"idcard": "string",
		"dob": "string",
		"contact": [
			{
				"name": "string",
				"age": "string",
				"profile": {
					"phone": "string",
					"idcard": [
						{
							"id": "string",
							"idobj": {
								"abc": "string"
							},
							"idarr": [
								{
									"hello": "string",
									"bye": "string"
								}
							]
						}
					]
				}
			}
		]
	},
	"keys": [
		{
			"key": "@Out{name}"
		},
		{
			"key": "@Out{age}"
		},
		{
			"key": "@Out{sex}"
		},
		{
			"key": "@Out{idcard}"
		},
		{
			"key": "@Out{dob}"
		},
		{
			"key": "@Out{contact}"
		},
		{
			"key": "@Out{contact.name}"
		},
		{
			"key": "@Out{contact.age}"
		},
		{
			"key": "@Out{contact.profile}"
		},
		{
			"key": "@Out{contact.profile.phone}"
		},
		{
			"key": "@Out{contact.profile.idcard}"
		},
		{
			"key": "@Out{contact.profile.idcard.id}"
		},
		{
			"key": "@Out{contact.profile.idcard.idobj}"
		},
		{
			"key": "@Out{contact.profile.idcard.idobj.abc}"
		},
		{
			"key": "@Out{contact.profile.idcard.idobj.idarr}"
		},
		{
			"key": "@Out{contact.profile.idcard.idobj.idarr.hello}"
		},
		{
			"key": "@Out{contact.profile.idcard.idobj.idarr.bye}"
		}
	]
};

var json2GOJSD_txtData = '{"schema":{"name":"string","age":"string","sex":"string","idcard":"string","dob":"string","contact":[{"name":"string","age":"string"}]},"keys":[{"key":"@In{name}"},{"key":"@In{age}"},{"key":"@In{sex}"},{"key":"@In{idcard}"},{"key":"@In{dob}"},{"key":"@In{contact}"},{"key":"@In{contact.name}"},{"key":"@In{contact.age}"}]}';
// json2GOJSD_txtData = JSON.stringify(json2GOJSD_Data);

var GOJS_Result = '{"class":"GraphLinksModel","nodeDataArray":[{"isGroup":true,"key":"inbound","text":"Inbound Schema","xy":"0 0","width":400},{"isGroup":true,"key":"outbound","text":"Outbound Schema","xy":"1000 0","width":400},{"key":"@In{name}","text":"name","type":"string","group":"inbound"},{"key":"@In{age}","text":"age","type":"string","group":"inbound"},{"key":"@In{sex}","text":"sex","type":"string","group":"inbound"},{"key":"@In{idcard}","text":"idcard","type":"string","group":"inbound"},{"key":"@In{dob}","text":"dob","type":"string","group":"inbound"},{"key":"@In{contact}","text":"contact","type":"array","group":"inbound"},{"key":"@In{contact.name}","text":"name","type":"string","group":"inbound"},{"key":"@In{contact.age}","text":"age","type":"string","group":"inbound"},{"key":"@In{contact.profile}","text":"profile","type":"object","group":"inbound"},{"key":"@In{contact.profile.phone}","text":"phone","type":"string","group":"inbound"},{"key":"@In{contact.profile.idcard}","text":"idcard","type":"array","group":"inbound"},{"key":"@In{contact.profile.idcard.id}","text":"id","type":"string","group":"inbound"},{"key":"@In{contact.profile.idcard.idobj}","text":"idobj","type":"object","group":"inbound"},{"key":"@In{contact.profile.idcard.idobj.abc}","text":"abc","type":"string","group":"inbound"},{"key":"@In{contact.profile.idcard.idobj.idarr}","text":"idarr","type":"array","group":"inbound"},{"key":"@In{contact.profile.idcard.idobj.idarr.hello}","text":"hello","type":"string","group":"inbound"},{"key":"@In{contact.profile.idcard.idobj.idarr.bye}","text":"bye","type":"string","group":"inbound"},{"key":"@Out{name}","text":"name","type":"string","group":"outbound"},{"key":"@Out{age}","text":"age","type":"string","group":"outbound"},{"key":"@Out{sex}","text":"sex","type":"string","group":"outbound"},{"key":"@Out{idcard}","text":"idcard","type":"string","group":"outbound"},{"key":"@Out{dob}","text":"dob","type":"string","group":"outbound"},{"key":"@Out{contact}","text":"contact","type":"array","group":"outbound"},{"key":"@Out{contact.name}","text":"name","type":"string","group":"outbound"},{"key":"@Out{contact.age}","text":"age","type":"string","group":"outbound"},{"key":"@Out{contact.profile}","text":"profile","type":"object","group":"outbound"},{"key":"@Out{contact.profile.phone}","text":"phone","type":"string","group":"outbound"},{"key":"@Out{contact.profile.idcard}","text":"idcard","type":"array","group":"outbound"},{"key":"@Out{contact.profile.idcard.id}","text":"id","type":"string","group":"outbound"},{"key":"@Out{contact.profile.idcard.idobj}","text":"idobj","type":"object","group":"outbound"},{"key":"@Out{contact.profile.idcard.idobj.abc}","text":"abc","type":"string","group":"outbound"},{"key":"@Out{contact.profile.idcard.idobj.idarr}","text":"idarr","type":"array","group":"outbound"},{"key":"@Out{contact.profile.idcard.idobj.idarr.hello}","text":"hello","type":"string","group":"outbound"},{"key":"@Out{contact.profile.idcard.idobj.idarr.bye}","text":"bye","type":"string","group":"outbound"}],"linkDataArray":[{"from":"@In{contact}","to":"@In{contact.name}"},{"from":"@In{contact}","to":"@In{contact.age}"},{"from":"@In{contact}","to":"@In{contact.profile}"},{"from":"@In{contact.profile}","to":"@In{contact.profile.phone}"},{"from":"@In{contact.profile}","to":"@In{contact.profile.idcard}"},{"from":"@In{contact.profile.idcard}","to":"@In{contact.profile.idcard.id}"},{"from":"@In{contact.profile.idcard}","to":"@In{contact.profile.idcard.idobj}"},{"from":"@In{contact.profile.idcard.idobj}","to":"@In{contact.profile.idcard.idobj.abc}"},{"from":"@In{contact.profile.idcard}","to":"@In{contact.profile.idcard.idobj.idarr}"},{"from":"@In{contact.profile.idcard.idobj.idarr}","to":"@In{contact.profile.idcard.idobj.idarr.hello}"},{"from":"@In{contact.profile.idcard.idobj.idarr}","to":"@In{contact.profile.idcard.idobj.idarr.bye}"},{"from":"@Out{contact}","to":"@Out{contact.name}"},{"from":"@Out{contact}","to":"@Out{contact.age}"},{"from":"@Out{contact}","to":"@Out{contact.profile}"},{"from":"@Out{contact.profile}","to":"@Out{contact.profile.phone}"},{"from":"@Out{contact.profile}","to":"@Out{contact.profile.idcard}"},{"from":"@Out{contact.profile.idcard}","to":"@Out{contact.profile.idcard.id}"},{"from":"@Out{contact.profile.idcard}","to":"@Out{contact.profile.idcard.idobj}"},{"from":"@Out{contact.profile.idcard.idobj}","to":"@Out{contact.profile.idcard.idobj.abc}"},{"from":"@Out{contact.profile.idcard}","to":"@Out{contact.profile.idcard.idobj.idarr}"},{"from":"@Out{contact.profile.idcard.idobj.idarr}","to":"@Out{contact.profile.idcard.idobj.idarr.hello}"},{"from":"@Out{contact.profile.idcard.idobj.idarr}","to":"@Out{contact.profile.idcard.idobj.idarr.bye}"},{"category":"Mapping","from":"@In{name}","to":"@Out{contact.name}"},{"category":"Mapping","from":"@In{contact.age}","to":"@Out{age}"}]}';

// Godmark : this is GOJS default sample code
// Use a TreeNode so that when a node is not visible because a parent is collapsed,
// connected links seem to be connected with the lowest visible parent node.
// This also forces other links connecting with nodes in the group to be rerouted,
// because collapsing/expanding nodes will cause many nodes to move and to appear or disappear.
class TreeNode extends go.Node {
	constructor() {
		super();
		this.treeExpandedChanged = node => {
			if (node.containingGroup !== null) {
				node.containingGroup.findExternalLinksConnected().each(l => l.invalidateRoute());
			}
		};
	}

	findVisibleNode() {
		// redirect links to lowest visible "ancestor" in the tree
		var n = this;
		while (n !== null && !n.isVisible()) {
			n = n.findTreeParentNode();
		}
		return n;
	}
}
// end TreeNode

//Godmark : this is GOJS to control the layout type , you can review the example in https://gojs.net/latest/samples/treeMapper.html , there have ToGroup , Normal , ToNode 3 options there
// Control how Mapping links are routed:
// - "Normal": normal routing with fixed fromEndSegmentLength & toEndSegmentLength
// - "ToGroup": so that the link routes stop at the edge of the group,
//     rather than going all the way to the connected nodes
// - "ToNode": so that they go all the way to the connected nodes
//     but only bend at the edge of the group
var ROUTINGSTYLE = "ToGroup";

// Godmark : MappingLink Class
// If you want the regular routing where the Link.[from/to]EndSegmentLength controls
// the length of the horizontal segment adjacent to the port, don't use this class.
// Replace MappingLink with a go.Link in the "Mapping" link template.
class MappingLink extends go.Link {
	getLinkPoint(node, port, spot, from, ortho, othernode, otherport) {
		if (ROUTINGSTYLE !== "ToGroup") {
			return super.getLinkPoint(node, port, spot, from, ortho, othernode, otherport);
		} else {
			var r = port.getDocumentBounds();
			var group = node.containingGroup;
			var b = (group !== null) ? group.actualBounds : node.actualBounds;
			var op = othernode.getDocumentPoint(go.Spot.Center);
			var x = (op.x > r.centerX) ? b.right : b.left;
			return new go.Point(x, r.centerY);
		}
	}

	computePoints() {
		var result = super.computePoints();
		if (result && ROUTINGSTYLE === "ToNode") {
			var fn = this.fromNode;
			var tn = this.toNode;
			if (fn && tn) {
				var fg = fn.containingGroup;
				var fb = fg ? fg.actualBounds : fn.actualBounds;
				var fpt = this.getPoint(0);
				var tg = tn.containingGroup;
				var tb = tg ? tg.actualBounds : tn.actualBounds;
				var tpt = this.getPoint(this.pointsCount-1);
				this.setPoint(1, new go.Point((fpt.x < tpt.x) ? fb.right : fb.left, fpt.y));
				this.setPoint(this.pointsCount-2, new go.Point((fpt.x < tpt.x) ? tb.left : tb.right, tpt.y));
			}
		}
		return result;
	}
}
// end MappingLink

//Godmark : nodeDataArray is data for control Left and Right Box UI Display
var nodeDataArray = [];
//Godmark : linkDataArray is data for control the relationship , we can make it empty as this moment
var linkDataArray = [];

var CurrentModel = null;
function init() {
	// Since 2.2 you can also author concise templates with method chaining instead of GraphObject.make
	// For details, see https://gojs.net/latest/intro/buildingObjects.html
	const $ = go.GraphObject.make;  // for conciseness in defining templates
	//Godmark : after drag & drop event make some relationship , can trigger the GOJS mapping reuslt into some textbox
	myDiagram =
	$(go.Diagram, "myDiagramDiv",
	{
		"commandHandler.copiesTree": true,
		"commandHandler.deletesTree": true,
		// newly drawn links always map a node in one tree to a node in another tree
		"linkingTool.archetypeLinkData": { category: "Mapping" },
		"linkingTool.linkValidation": checkLink,
		"relinkingTool.linkValidation": checkLink,
		"undoManager.isEnabled": true,
		"ModelChanged": e => {
			if (e.isTransactionFinished) {  // show the model data in the page's TextArea
				document.getElementById("mySavedModel").textContent = e.model.toJson();
				document.getElementById("mySavedModel2").value = e.model.toJson();
				CurrentModel = e.model;
			}
		}
	});

	// Godmark : some link control
	// All links must go from a node inside the "Left Side" Group to a node inside the "Right Side" Group.
	function checkLink(fn, fp, tn, tp, link) {
		// make sure the nodes are inside different Groups
		if (fn.containingGroup === null || fn.containingGroup.data.key !== "inbound") return false;
		if (tn.containingGroup === null || tn.containingGroup.data.key !== "outbound") return false;

		// fn = Inbound Column
		if (fn.data.type == "object") {
			// tn = Outbound Column
			if(tn.data.type == "integer" || tn.data.type == "number" || tn.data.type == "boolean") return false;
		}

		// fn = Inbound Column
		if (fn.data.type == "string") {
			// tn = Outbound Column
			if(tn.data.type == "integer" || tn.data.type == "number" || tn.data.type == "boolean") return false;
		}

		// fn = Inbound Column
		if (fn.data.type == "array") {
			// tn = Outbound Column
			if(tn.data.type == "object" || tn.data.type == "integer" || tn.data.type == "number" || tn.data.type == "boolean") return false;
		}
		//// optional limit to a single mapping link per node
		if (tn.linksConnected.any(l => l.category === "Mapping") && tn.data.type != "array") return false;
		//if (fn.linksConnected.any(l => l.category === "Mapping")) return false;
		//if (tn.linksConnected.any(l => l.category === "Mapping")) return false;
		return true;
	}

	function onSelectionChanged(node) {
		if (node.isSelected) {
			// Try to open properties here
			console.log(node.data);
			console.log(node.linksConnected);
			var linksConnected = node.linksConnected;
			while (linksConnected.next()){
				console.log(linksConnected.value);
				//console.log(linksConnected.value.fromNode.data);
				console.log(linksConnected.value.toNode.data);
			}
		}
	}

	// Godmark : some GOJS event setting , if you want the display name on the UI Box show "text" or another variable from nodeDataArray , can be setup here , e.g. $(go.TextBlock, new go.Binding("text",))
	// Each node in a tree is defined using the default nodeTemplate.
	myDiagram.nodeTemplate =
	$(TreeNode,
		{ movable: false, copyable: false, deletable: false },  // user cannot move an individual node
		// no Adornment: instead change panel background color by binding to Node.isSelected
		{
			selectionChanged: onSelectionChanged,
			selectionAdorned: false,
			background: "white",
			mouseEnter: (e, node) => node.background = "aquamarine",
			mouseLeave: (e, node) => node.background = node.isSelected ? "skyblue" : "white"
		},
		new go.Binding("background", "isSelected", s => s ? "skyblue" : "white").ofObject(),
		// whether the user can start drawing a link from or to this node depends on which group it's in
		new go.Binding("fromLinkable", "group", k => k === "inbound"),
		new go.Binding("toLinkable", "group", k => k === "outbound"),
		$("TreeExpanderButton",  // support expanding/collapsing subtrees
			{
				width: 14, height: 14,
				"ButtonIcon.stroke": "white",
				"ButtonIcon.strokeWidth": 2,
				"ButtonBorder.fill": "goldenrod",
				"ButtonBorder.stroke": null,
				"ButtonBorder.figure": "Rectangle",
				"_buttonFillOver": "darkgoldenrod",
				"_buttonStrokeOver": null,
				"_buttonFillPressed": null
			}
		),
		$(go.Panel, "Horizontal",
			{ position: new go.Point(16, 0) },
			// optional icon for each tree node
			//$(go.Picture,
			//  { width: 14, height: 14,
			//    margin: new go.Margin(0, 4, 0, 0),
			//    imageStretch: go.GraphObject.Uniform,
			//    source: "images/defaultIcon.png" },
			//  new go.Binding("source", "src")),
			//Column Type Icons
			$(go.Picture, { source: "string.png", width: 20, height: 20 }, new go.Binding("source","type", v => "/app-assets/images/mapping/"+v+".png"   )    ),
			//Column name
			$(go.TextBlock,new go.Binding("text","text")),
			//Column type
			$(go.TextBlock, new go.Binding("text","type", v => "  (" + v +")" )),
		)  // end Horizontal Panel
	);  // end Node

	// These are the links connecting tree nodes within each group.

	//Godmark : some Layout Configure
	myDiagram.linkTemplate = $(go.Link);  // without lines

	myDiagram.linkTemplate =  // with lines
	$(go.Link,
		{
			selectable: false,
			routing: go.Link.Orthogonal,
			fromEndSegmentLength: 4,
			toEndSegmentLength: 4,
			fromSpot: new go.Spot(0.001, 1, 7, 0),
			toSpot: go.Spot.Left
		},
		$(go.Shape,
		{ stroke: "lightgray" })
	);

	// These are the blue links connecting a tree node on the left side with one on the right side.
	myDiagram.linkTemplateMap.add("Mapping",
	$(MappingLink,
		{ isTreeLink: false, isLayoutPositioned: false, layerName: "Foreground" },
		{ fromSpot: go.Spot.Right, toSpot: go.Spot.Left },
		{ relinkableFrom: true, relinkableTo: true },
		$(go.Shape, { stroke: "blue", strokeWidth: 2 })
	));

	myDiagram.groupTemplate =
	$(go.Group, "Auto",
		{ deletable: false, layout: makeGroupLayout() },
		new go.Binding("position", "xy", go.Point.parse).makeTwoWay(go.Point.stringify),
		new go.Binding("layout", "width", makeGroupLayout),
		$(go.Shape, { fill: "white", stroke: "lightgray" }),
		$(go.Panel, "Vertical",
			{ defaultAlignment: go.Spot.Left },
			$(go.TextBlock,
				{ font: "bold 14pt sans-serif", margin: new go.Margin(5, 5, 0, 5) },
			new go.Binding("text")),
			$(go.Placeholder, { padding: 5 })
		)
	);

	function makeGroupLayout() {
		return $(go.TreeLayout,  // taken from samples/treeView.html
		{
			alignment: go.TreeLayout.AlignmentStart,
			angle: 0,
			compaction: go.TreeLayout.CompactionNone,
			layerSpacing: 16,
			layerSpacingParentOverlap: 1,
			nodeIndentPastParent: 1.0,
			nodeSpacing: 0,
			setsPortSpot: false,
			setsChildPortSpot: false,
			// after the tree layout, change the width of each node so that all
			// of the nodes have widths such that the collection has a given width
			commitNodes: function() {  // overriding TreeLayout.commitNodes
			  go.TreeLayout.prototype.commitNodes.call(this);
			  if (ROUTINGSTYLE === "ToGroup") {
				updateNodeWidths(this.group, this.group.data.width || 100);
			  }
			}
		});
	}
}

//Godmark : makeTree is no use now, is copy from GOJS example
// help create a random tree structure
function makeTree(level, count, max, nodeDataArray, linkDataArray, parentdata, groupkey, rootkey) {
	var numchildren = Math.floor(Math.random() * 10);
	for (var i = 0; i < numchildren; i++) {
		if (count >= max) return count;
		count++;
		var childdata = { key: rootkey + count, text: rootkey + count,  group: groupkey };
		nodeDataArray.push(childdata);
		linkDataArray.push({ from: parentdata.key, to: childdata.key });
		if (level > 0 && Math.random() > 0.5) {
			count = makeTree(level - 1, count, max, nodeDataArray, linkDataArray, childdata, groupkey, rootkey);
		}
	}
	return count;
}

//Godmark : some GOJS Event
window.addEventListener('DOMContentLoaded', init);

function updateNodeWidths(group, width) {
	if (isNaN(width)) {
		group.memberParts.each(n => {
			if (n instanceof go.Node) n.width = NaN;  // back to natural width
		});
	} else {
		var minx = Infinity;  // figure out minimum group width
		group.memberParts.each(n => {
			if (n instanceof go.Node) {
				minx = Math.min(minx, n.actualBounds.x);
			}
		});
		if (minx === Infinity) return;
		var right = minx + width;
		group.memberParts.each(n => {
			if (n instanceof go.Node) n.width = Math.max(0, right - n.actualBounds.x);
		});
	}
}

// this function is only needed when changing the value of ROUTINGSTYLE dynamically
function changeStyle() {
	// find user-chosen style name
	var stylename = "ToGroup";
	var radio = document.getElementsByName("MyRoutingStyle");
	for (var i = 0; i < radio.length; i++) {
		if (radio[i].checked) {
			stylename = radio[i].value; break;
		}
	}
	if (stylename !== ROUTINGSTYLE) {
		myDiagram.commit(diag => {
			ROUTINGSTYLE = stylename;
			diag.findTopLevelGroups().each(g => updateNodeWidths(g, NaN));
			diag.layoutDiagram(true);  // force layouts to happen again
			diag.links.each(l => l.invalidateRoute());
		});
	}
}

// Global variables to save previous inbound & outbound GOJS nodeDataArray & linkDataArray
var inbound_nodes = [];
var inbound_linkdata = [];
var outbound_nodes = [];
var outbound_linkdata = [];
// the Count for LoopSchemaArray use
var SchemaCount = 0;

function LoopSchemaArray(schemaArray,group,nodes,keys,linkdata)
{
	//Get the Current Node , if can not find the key from keys(array) , will use SchemaCount-1
	var ParentNode = (typeof(keys[SchemaCount-1]) == 'undefined' ? SchemaCount-1:keys[SchemaCount-1]);
	// Array
	if (Array.isArray(schemaArray)) {
		for (var key in schemaArray) {
		
			for (var column in schemaArray[key]) {
			
				var isArray = Array.isArray(schemaArray[key][column]);
				// var columnType = (isArray ? 'array' : typeof(schemaArray[key][column]));
				var columnType = (isArray ? 'array' : (typeof(schemaArray[key][column]) == 'object') ? 'object' : schemaArray[key][column]);
				var columnKey = (typeof(keys[SchemaCount]) == 'undefined' ? SchemaCount:keys[SchemaCount]);
				var nodeData = { key: columnKey,text: column, type: columnType, group: group };
				
				nodes.push(nodeData);
				
				linkdata.push({from: ParentNode, to:(typeof(keys[SchemaCount]) == 'undefined' ? SchemaCount:keys[SchemaCount])});
				SchemaCount++;
	
				if (columnType == 'array' || columnType == 'object') LoopSchemaArray(schemaArray[key][column],group,nodes,keys,linkdata);
				
			}
		}
	} 
	// Object
	else {
		for (var column in schemaArray) {
		
			var isArray = Array.isArray(schemaArray[column]);
			// var columnType = (isArray ? 'array' : typeof(schemaArray[column]));
			var columnType = (isArray ? 'array' : (typeof(schemaArray[column]) == 'object') ? 'object' : schemaArray[column]);
			var columnKey = (typeof(keys[SchemaCount]) == 'undefined' ? SchemaCount:keys[SchemaCount]);
			var nodeData = { key: columnKey ,text: column, type: columnType, group: group };
			nodes.push(nodeData);
			linkdata.push({from:ParentNode , to:columnKey});
			SchemaCount++;
			
			if (columnType == 'array' || columnType == 'object') LoopSchemaArray(schemaArray[column],group,nodes,keys,linkdata);
			
		}
	}
}
// Convert GOJSD to 2 variables (nodes,linkdata) let it can apply to nodeDataArray & linkDataArray
function GOJSD_Convertor(schemaText,group="inbound") {
	//convert API String to Json 
	schemaData = JSON.parse(schemaText);

	var linkdata = [];
	var nodes = [];

	// keys is save the sequence of @In{} or @Out{}
	var keys = [];
	for (var keycount in schemaData["keys"]) {
		keys.push(schemaData["keys"][keycount].key);
	}
	//console.log(keys);

	// Loop the "schema" from API Result
	for (var column in schemaData["schema"]) {
		var isArray = Array.isArray(schemaData["schema"][column]);
		// var columnType = (isArray ? 'array' : typeof(schemaData["schema"][column]));
		var columnType = (isArray ? 'array' : (typeof(schemaData["schema"][column]) == 'object') ? 'object' : schemaData["schema"][column]);

		// node Data will be key , text, type, group 4 object
		// keys[SchemaCount] to get the @In{} or @Out{} unique name
		var nodeData = { key: keys[SchemaCount], text: column, type: columnType, group: group };

		//push the node Data into nodes
		nodes.push(nodeData);

		//SchemaCount++ to next keys
		SchemaCount++;

		// if column is array or object then loop the sub level by LoopSchemaArray
		if (columnType == 'array' || columnType == 'object') LoopSchemaArray(schemaData["schema"][column],group,nodes,keys,linkdata);
	}

	// return nodes and linkdata
	var nodes_and_linkdata = {nodes:nodes,linkdata:linkdata};

	return nodes_and_linkdata;
}

// Function for Inbound Upload Button
function InboundDataBind() {
	var jsonData = $("#InboundFormatData").val();
	var dataObj = JSON.parse(jsonData);
	$.ajax({
		url: '/mapping/convert/injson2GOJSD',  
		method: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(dataObj),
		header: {
			"content-type": "application/json"
		},
		success: function(response) {
			console.log(response);
			var newInboundJson = response;

			SchemaCount = 0;
			//Inbound and Outbund Group in GOJS UI
			var inboundGroup = [{ isGroup: true, key: "inbound", text: "Inbound Schema", xy: "0 0", width: 400 }];
			var outboundGroup = [{ isGroup: true, key: "outbound", text: "Outbound Schema", xy: "800 0", width: 400 }];

			// When user fill in Inbound_Format Textbox (id=InboundFormat)
			// must post this Textbox value injson2GOJSD API ,and then GOJSD_Convertor(<injson2GOJSD result>,"inbound");
			// Now hardcode a Temporary Sample data used json2GOJSD_txtData variable
			var nodes_and_linkdata = GOJSD_Convertor(JSON.stringify(newInboundJson),"inbound");

			//GOJSD_Convertor will return the (obj).nodes & (obj).linkdata
			inbound_nodes = nodes_and_linkdata.nodes;
			inbound_linkdata = nodes_and_linkdata.linkdata;

			// 2 Variables to merge previous outbound scheme
			var nodesResult = [...inboundGroup,...outboundGroup,...inbound_nodes,...outbound_nodes];
			var linkdataResult = [...inbound_linkdata,...outbound_linkdata];

			console.log(nodesResult);
			console.log(linkdataResult);

			// apply 2 merged variables into nodeDataArray & linkDataArray
			nodeDataArray = nodesResult;
			linkDataArray = linkdataResult;

			//Init GOJS UI
			myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

		},
		error: function(response) {
			alert('server error');
		}
	});
}

// Function for Outbound Upload Button , all comments can reference to InboundDataBind();
function OutboundDataBind() {
	var jsonData = $("#OutboundFormatData").val();
	var dataObj = JSON.parse(jsonData);
	$.ajax({
		url: '/mapping/convert/outjson2GOJSD',  
		method: 'POST',
		dataType: 'json',
		contentType: "application/json",
		data: JSON.stringify(dataObj),
		header: {
			"content-type": "application/json"
		},
		success: function(response) {
			console.log(response);
			var newOutboundJson = response;

			SchemaCount = 0;
			var inboundGroup = [{ isGroup: true, key: "inbound", text: "Inbound Schema", xy: "0 0", width: 400 }];
			var outboundGroup = [{ isGroup: true, key: "outbound", text: "Outbound Schema", xy: "1000 0", width: 400 }];

			var nodes_and_linkdata = GOJSD_Convertor( JSON.stringify(newOutboundJson),"outbound");

			outbound_nodes = nodes_and_linkdata.nodes;
			outbound_linkdata = nodes_and_linkdata.linkdata;

			var nodesResult = [...inboundGroup,...outboundGroup,...inbound_nodes,...outbound_nodes];
			var linkdataResult = [...inbound_linkdata,...outbound_linkdata];

			console.log(nodesResult);
			console.log(linkdataResult);

			nodeDataArray = nodesResult;
			linkDataArray = linkdataResult;

			myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

		},
		error: function(response) {
			alert('server error');
		}
	});
}

function GojsLoadData() {
	myDiagram.model = go.Model.fromJson(GOJS_Result);
}

//Godmark : Download the inbound  json format
function saveBGRSJSON() {
	var data = InboundJson;
	var filename = uuid()+gettime()+".json";
	if (typeof data === 'object') {
	  data = JSON.stringify(data, undefined, 4)
	}
	var blob = new Blob([data], { type: 'text/json' });
	var e = document.createEvent('MouseEvents');
	var a = document.createElement('a');
	a.download = filename;
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e);
}

//Godmark : Download the inbound  json format
function saveiRMSJSON() {
	var data = OutboundJson;
	var filename = uuid()+gettime()+".json";;
	if (typeof data === 'object') {
	  data = JSON.stringify(data, undefined, 4)
	}
	var blob = new Blob([data], { type: 'text/json' });
	var e = document.createEvent('MouseEvents');
	var a = document.createElement('a');
	a.download = filename;
	a.href = window.URL.createObjectURL(blob);
	a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
	e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	a.dispatchEvent(e);
}

function uuid() {
	var s = [];
	var hexDigits = "0123456789abcdef";
	for (var i = 0; i < 36; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	}
	s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
	s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
	s[8] = s[13] = s[18] = s[23] = "-";

	var uuid = s.join("");
	return uuid;
}

function gettime() {
	var today=new Date();
	var y=today.getFullYear();
	var m=today.getMonth();
	var d=today.getDate();
	var h=today.getHours();
	var i=today.getMinutes();
	var s=today.getSeconds();// 在小于10的数字钱前加一个‘0’
	m=m+1;
	d=checkTime(d);
	m=checkTime(m);
	i=checkTime(i);
	s=checkTime(s);
	$('#time').html(y+"年"+m+"月"+d+"日"+" "+h+":"+i+":"+s);
	return (y+"-"+m+"-"+d+"-"+" "+h+":"+i+":"+s);
}

function checkTime(i){
	if (i<10){
		i="0" + i;
	}
	return i;
}