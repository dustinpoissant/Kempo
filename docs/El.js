var El=(function(){var c={};var a=new MutationObserver(function(g){for(var h=0;h<g.length;h++){for(var l=0;l<g[h].removedNodes.length;l++){var k=g[h].removedNodes[l];if(k.nodeType==3){continue}var e=k.tagName.toLowerCase();var j=c[k.tagName.toLowerCase()];if(j){j.detached(k)}}for(var f=0;f<g[h].addedNodes.length;f++){var k=g[h].addedNodes[f];if(k.nodeType==3){continue}var j=c[k.tagName.toLowerCase()];if(j){j.attached(k)}}}});function d(){a.observe(document.body,{childList:true,subtree:true});for(var e in c){var g=document.getElementsByTagName(e);for(var f=0;f<g.length;f++){c[e].attached(g[f])}}}if(document.readyState==="complete"){d()}else{document.addEventListener("DOMContentLoaded",d)}return function b(f,g){this.attached=function(i){if(g.attached){g.attached.call(i)}if(g.changed){e(i)}return this};this.detached=function(i){if(i.observer){i.observer.disconnect();delete i.observer}if(g.detached){g.detached.call(i)}return this};function e(i){var k=g.watch||{attributes:true,children:true,text:true};if(k.attributes||k.children){i.observer=new MutationObserver(function(n){var p={attributes:{},children:{added:[],removed:[]}};for(var o=0;o<n.length;o++){var l=n[o];if(l.type=="attributes"){p.attributes[l.attributeName]={value:i.getAttribute(l.attributeName),oldValue:l.oldValue}}else{if(l.type=="childList"){p.children.added=[].slice.call(l.addedNodes);p.children.removed=[].slice.call(l.removedNodes)}else{if(l.type=="characterData"){p.text={value:i.innerText,oldValue:i._oldText};i._oldText=i.innerText}}}}g.changed.call(i,p)});var j={};if(k.attributes){j.attributes=true;j.attributeOldValue=true;if(k.attributes instanceof Array){j.attributeFilter=k.attributes}else{if(typeof(k.attributes)=="string"){j.attributesFilter=k.attributes.split(" ").concat(k.attributes.split(","))}}}if(k.children){j.childList=true;j.subtree=true}if(k.text){i._oldText=i.innerText;j.subtree=true;j.characterData=true}i.observer.observe(i,j)}}c[f.toLowerCase()]=this;if(document.registerElement){try{document.registerElement(f.toLowerCase())}catch(h){}}}})();