var Kempo=(function(){var a=function(l,k){if(typeof(l)=="function"){if(document.readyState=="complete"){l()}else{document.addEventListener("DOMContentLoaded",l)}}else{if(l[0]=="["&&l[l.length-1]=="]"){var m=l.substr(1,l.length-2);g.push(m);h[m]=new b(l,k);j()}else{e[l]=new c(l,k)}}return a};a.version={core:"0.18.0"};function d(l){var k=[];for(var m=0;m<l.length;m++){if(l[m].nodeType!=3){k.push(l[m]);k=k.concat(d(l[m].childNodes))}}return k}var c=function(l,m){this.added=function(o,n,p){if(m.added){m.added.call(o,n,p)}if(m.changed&&m.watch){k(o)}};this.removed=function(o,n){if(m.removed){m.removed.call(o)}if(o.observer){o.observer.disconnect();delete o.observer}};function k(n){var o={};if(m.watch.attributes){o.attributes=true;o.attributeOldValue=true;if(m.watch.attributes instanceof Array){o.attributeFilter=m.watch.attributes}}if(m.watch.children){o.childList=true;o.subtree=true}if(m.watch.text){o.childList=true;o.subtree=true;o.characterData=true;n._oldInnerText=n.innerText}n.observer=new MutationObserver(function(q){for(var r=0;r<q.length;r++){var p=q[r];if(m.watch&&m.watch.attributes&&p.type=="attributes"){m.changed.call(p.target,{attribute:{name:p.attributeName,oldValue:p.oldValue,newValue:p.target.getAttribute(p.attributeName)}})}if(m.watch&&m.watch.children&&p.type=="childList"){if(d(p.addedNodes).length){m.changed.call(p.target,{children:{added:[].slice.call(p.addedNodes)}})}if(d(p.removedNodes).length){m.changed.call(p.target,{children:{removed:[].slice.call(p.removedNodes)}})}}if(m.watch&&m.watch.text&&p.target._oldInnerText!=p.target.innerText){m.changed.call(p.target,{text:{oldValue:p.target._oldInnerText,newValue:p.target.innerText}});p.target._oldInnerText=p.target.innerText}}});n.observer.observe(n,o)}};var b=function(l,k){this.added=function(n,m,o){if(k.added){k.added.call(n,m,o)}};this.removed=function(n,m,o){if(k.removed){k.removed.call(n,m,o)}};this.changed=function(n,m,o,p){if(k.changed){k.changed.call(n,m,o,p)}}};var e={};var h={};var g=[];var f=new MutationObserver(function(o){for(var s=0;s<o.length;s++){var p=o[s];if(p.type=="attributes"){var v=p.attributeName;var q=h[v];if(q){var n=p.target.getAttribute(p.attributeName);if(p.attributeOldValue===null){q.added(p.target,v,n)}else{if(n===null){q.removed(p.target,v,p.oldValue)}else{q.changed(p.target,v,p.oldValue,n)}}}}if(p.type=="childList"&&p.addedNodes.length){var t=d(p.addedNodes);for(var w in t){var l=e[t[w].tagName.toLowerCase()];if(l){l.added(t[w])}for(var v in h){if(t[w].getAttribute(v)!==null){var q=h[v];if(q){q.added(t[w],v,t[w].getAttribute(v))}}}}}if(p.type=="childList"&&p.removedNodes.length){var u=d(p.removedNodes);for(var k in u){var l=e[u[k].tagName.toLowerCase()];if(l){l.removed(u[k])}}}}});function i(){var k={subtree:true,childList:true};if(g.length){k.attributes=true;k.attributeOldValue=true;k.attributeFilter=g}return k}function j(){function k(){if(j.first){for(var m in e){var p=document.getElementsByTagName(m);for(var n=0;n<p.length;n++){e[m].added(p[n])}}for(var l in h){var o=document.querySelectorAll("["+l+"]");for(var n=0;n<o.length;n++){h[l].added(o[n],l,o[n].getAttribute(l))}}j.first=false}f.disconnect();f.observe(document.body,i())}if(document.readyState=="complete"){k()}else{document.addEventListener("DOMContentLoaded",k)}}j.first=true;j();return a})();