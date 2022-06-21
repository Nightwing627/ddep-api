//Godmark : i will add "Godmark" in which related GOJS coding to let you know what is doing
	
	//Godmark : this is the Left & Right Box Title on GOJS 
	var LeftSideName = "Inbound Source Schema";
	var RightSideName = "Outbound Source Schema"

	// Godmark: this function is no use as this moment
	const JsonToArray = obj => {
	   const keys = Object.keys(obj);
	   const res = [];
	   for(let i = 0; i < keys.length; i++){
		  res.push(obj[keys[i]]);
	   };
	   return res;
	};
	
	// Godmark : hardcode defined the "InboundJson Format"
	var InboundJson = {
		"name":"",
		"age":"",
		"sex":"",
		"idcard":"",
		"dob":"",
		"contact": {
			"name":""
		}
	}
	/* this is another example
	var InboundJson = 
	{
	  "BGRSFileNumber":"8392165",
	  "ClientParentCompany":"10362",
	  "BGRSConsultantFirstName":"Jane",
	  "BGRSConsultantPhone":"987-654-3210",
	  "BGRSConsultantEmail":"Jane.Doe@bgrs.com",
	  "PendingStartDate":"2020-07-22T00:00:00",
	  "PendingEndDate":"2020-07-22T00:00:00",
	  "Assignee":{
		  "FirstName":"Peter",
		  "LastName":"Bell",
		  "MobilePhone":"",
		  "OfficePhone":"2134569877",
		  "HomeDestinationPhone":null,
		  "OfficeDestinationPhone":null,
		  "Email":"psmith@gmail.com",
		  "MaritalStatus":"Married",
		  "Citizenship":"American",
		  "JobTitle":"VP",
		  "IsSOX":true,
	  }
	}*/
	

	// Godmark : hardcode defined the OutboundJson Format
	var OutboundJson =  {
		"staffinfo":{
			"staffname":"",
			"age":"",
			"gender":""
		}
	}
	
	/* this is another example
	var OutboundJson =  {
	    "InitiationBy":{
	        "OrderCode":"",
	        "InitiationBy":"",
	        "Email":"",
	        "PhoneCountryIdd":"",
	        "PhoneCityIdd":"",
	        "Phone":"",
	        "MobileCountryIdd":"",
	        "MobileCityIdd":"",
	        "Mobile":"",
	        "FaxCountryIdd":"",
	        "FaxCityIdd":"",
	        "Fax":"",
	        "CompanyReference":"",
	        "SuppressWFEmailToHRFg":""
	    },
	    "InitiationTransferee":{
	        "FirstName":"",
	        "LastName":"",
	        "Email":"",
			"OriginMobilePhone":"",
			"OriginPhone":"",
			"DestinationPhone":"",
			"MaritalStatus":"",
	        "AssignmentDateFrom":"",
	        "AssignmentDateTo":"",  
	        "Nationality":"",
	        "DestinationNewPosition":"",
	    },

	}
	*/



























	
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
	var nodeDataArray = [
        { isGroup: true, key: -1, text: LeftSideName, xy: "0 0", width: 400 }

      ];
	//Godmark : linkDataArray is data for control the relationship , we can make it empty as this moment
	 var linkDataArray = [];
	/* the another example i defined before
	  var linkDataArray = [
      
	  {
            "category":"Mapping",
            "from":0,
            "to":1013
        },
        {
            "category":"Mapping",
            "from":2,
            "to":1002
        },
        {
            "category":"Mapping",
            "from":3,
            "to":1006
        },
        {
            "category":"Mapping",
            "from":4,
            "to":1003
        },
        {
            "category":"Mapping",
            "from":5,
            "to":1023
        },
        {
            "category":"Mapping",
            "from":6,
            "to":1024
        },
        {
            "category":"Mapping",
            "from":8,
            "to":1016
        },
        {
            "category":"Mapping",
            "from":9,
            "to":1017
        },
        {
            "category":"Mapping",
            "from":10,
            "to":1019
        },
        {
            "category":"Mapping",
            "from":11,
            "to":1020
        },
        {
            "category":"Mapping",
            "from":13,
            "to":1021
        },
        {
            "category":"Mapping",
            "from":14,
            "to":1018
        },
        {
            "category":"Mapping",
            "from":15,
            "to":1022
        },
        {
            "category":"Mapping",
            "from":16,
            "to":1025
        },
        {
            "category":"Mapping",
            "from":17,
            "to":1026
        }
   
      ];
	  */
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
        if (fn.containingGroup === null || fn.containingGroup.data.key !== -1) return false;
        if (tn.containingGroup === null || tn.containingGroup.data.key !== -2) return false;
        //// optional limit to a single mapping link per node
        //if (fn.linksConnected.any(l => l.category === "Mapping")) return false;
        //if (tn.linksConnected.any(l => l.category === "Mapping")) return false;
		
        return true;
      }

	 //Godmark : some GOJS event setting , if you want the display name on the UI Box show "text" or another variable from nodeDataArray , can be setup here , e.g. $(go.TextBlock, new go.Binding("text",))
      // Each node in a tree is defined using the default nodeTemplate.
      myDiagram.nodeTemplate =
        $(TreeNode,
          { movable: false, copyable: false, deletable: false },  // user cannot move an individual node
          // no Adornment: instead change panel background color by binding to Node.isSelected
          {
            selectionAdorned: false,
            background: "white",
            mouseEnter: (e, node) => node.background = "aquamarine",
            mouseLeave: (e, node) => node.background = node.isSelected ? "skyblue" : "white"
          },
          new go.Binding("background", "isSelected", s => s ? "skyblue" : "white").ofObject(),
          // whether the user can start drawing a link from or to this node depends on which group it's in
          new go.Binding("fromLinkable", "group", k => k === -1),
          new go.Binding("toLinkable", "group", k => k === -2),
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
            }),
          $(go.Panel, "Horizontal",
            { position: new go.Point(16, 0) },
            //// optional icon for each tree node
            //$(go.Picture,
            //  { width: 14, height: 14,
            //    margin: new go.Margin(0, 4, 0, 0),
            //    imageStretch: go.GraphObject.Uniform,
            //    source: "images/defaultIcon.png" },
            //  new go.Binding("source", "src")),
            $(go.TextBlock,
              //new go.Binding("text", "key", s => "" + s))
			  new go.Binding("text",))
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
            { stroke: "lightgray" }));

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


     
     
	  


	 
      

      // initialize tree on left side
	  
      /*
      for (var i = 0; i < 11;) {
		//(level, count, max, nodeDataArray, linkDataArray, parentdata, groupkey, rootkey)
        i = makeTree(3, i, 17, nodeDataArray, linkDataArray, root, -1, root.key);
      }
	  */
	  // Godmark:Initialize Inbound Source Schema
	  var InboundCount = 0;
	  var InboundCurrentCount = 0;
	
	  // Godmark : this is a function looping Inbound Json , and this is custom code , and this code just only can support 2 level node json , so it not very dynamic,  if you have any question , can ask me , all Json column will push into nodeDataArray
	  Object.entries(InboundJson).forEach((entry) => {
		
		// the key of the Inbound Json
		const [key,value] = entry;
		
		// Godmark : key is the number on this example , the key mean that is unique number or id or name , so we should be discuss what the parameter on the key , i suggest @In{(Column Unique Name)} or @Out{(Column Unique Name)} , the text = column name , group:-1 = Left Side Box
		var inbounddata = { key: InboundCount,text : key, group: -1 };
		nodeDataArray.push(inbounddata);
		
		//Godmark : 第二層 , 暫時不是很彈性,先這樣
		InboundCurrentCount = InboundCount;
		InboundCount++;
		if (value != null && typeof(value) == "object") {
			Object.entries(value).forEach((itementry) => {
				
				const [subkey,subvalue] = itementry;
				var inbounddata = { key: InboundCount,text : subkey, group: -1 };
				// Godmark : linkDataArray in this from , to is for grouping , it mean subgroup or sub sub group , and linkDataArray have another use for relationship mapping , you can review the line "3792" , all relationship will be have one more field call category:"mapping" there
				linkDataArray.push({ from: InboundCurrentCount, to: InboundCount });
				
				nodeDataArray.push(inbounddata);
				console.log(subkey + "::::" + InboundCurrentCount+"::::"+InboundCount)
				InboundCount++;
				
			});
		}
		
		
		
	  });

	  myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);


		// Godmark : initiated the Outbound Right Box UI
		nodeDataArray.push({ isGroup: true, key: -2, text: RightSideName, xy: "600 0", width: 400 });
		myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
		var OutboundCount = 1000;
		var OutboundCurrentCount = 1000;
		
		
	  // Godmark : this is a function looping Outbound Json , and this is custom code , and this code just only can support 2 level node json , so it not very dynamic,  if you have any question , can ask me , all Json column will push into nodeDataArray
		Object.entries(OutboundJson).forEach((entry) => {
		// the key of the Outbound Json
		const [key,value] = entry;
		var Outbounddata = { key: OutboundCount,text : key, group: -2 };
		nodeDataArray.push(Outbounddata);
		
		OutboundCurrentCount = OutboundCount;
		OutboundCount++;
		if (value != null && typeof(value) == "object") {
		Object.entries(value).forEach((itementry) => {
			const [subkey,subvalue] = itementry;
			var Outbounddata = { key: OutboundCount,text : subkey, group: -2 };
			// Godmark : same as inbound 
			linkDataArray.push({ from: OutboundCurrentCount, to: OutboundCount });
			
			nodeDataArray.push(Outbounddata);
			console.log(":::::::Outbounddata:::::::::::");
			console.log("--------------------------");
			console.log(subkey + "::::" + OutboundCurrentCount+"::::"+OutboundCount)
			OutboundCount++;	
		});
		}
		});

		myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
	  
	  
	  
	  // Godmark:No use 
      // initialize tree on right side
      /*root = { key: 1000, group: -2 };
      nodeDataArray.push(root);
      for (var i = 0; i < 15;) {
        i = makeTree(3, i, 15, nodeDataArray, linkDataArray, root, -2, root.key);
      }
	  */
	  //Godmark : 生成
     
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
	
	//Godmark : a function trigger GOJS result to some textbox
	function UpdateJson() {
		document.getElementById("mySavedModel2").value = CurrentModel.toJson();
	}
	//Godmark : a function trigger GOJS result to some textbox <- it example used on Inbound Upload Button
  function AddInboundSchema() {
	 myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
	 $("#InboundJson").show();
	


	

	}

	//Godmark : a function trigger GOJS result to some textbox <- it example used on Outbound Upload Button
	function AddOutboundSchema() {
		$("#OutboundJson").show();
	

		var OutboundCount = 0;
		var OutboundCurrentCount = 0;
		Object.entries(OutboundJson).forEach((entry) => {

		// the key of the Outbound Json
		const [key,value] = entry;

		var Outbounddata = { key: OutboundCount,text : key, group: -2 };
		nodeDataArray.push(Outbounddata);
	

		//Godmark : 第二層 , 暫時不是很彈性,先這樣
		OutboundCurrentCount = OutboundCount;
		OutboundCount++;
		if (value != null && typeof(value) == "object") {
		Object.entries(value).forEach((itementry) => {
			
			const [subkey,subvalue] = itementry;
			var Outbounddata = { key: OutboundCount,text : subkey, group: -2 };
			linkDataArray.push({ from: OutboundCurrentCount, to: OutboundCount });
			
			nodeDataArray.push(Outbounddata);
			console.log(subkey + "::::" + OutboundCurrentCount+"::::"+OutboundCount)
			OutboundCount++;
			
		});
		}



		});

		myDiagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

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

	const app = new Vue({
    	el: '#app',    
    	data() {
				return {
					apis: [
						{
							value: ''
						}
					]
				}
			},
			methods: {
				addNewItem () {
					this.apis.push({
						value: ''
					})
				},
				removeItem (index) {
					this.apis.splice(index, 1)
				}
			}
		})
	