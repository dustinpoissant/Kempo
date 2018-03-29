/* A single global variable named "Kempo" is exposed from the closure */
var Kempo = (function(){
  /*
    The main function that will be the entry point to all features of the library
  */
  var Kempo = function(arg1, arg2){
    if(arg1 instanceof Array){
      for(var i=0; i<arg1.length; i++){
        Kempo(arg1[i], arg2);
      }
      return Kempo;
    } else if(typeof(arg1) == "function"){
      if(document.readyState == "complete") arg1();
      else document.addEventListener("DOMContentLoaded", arg1);
    } else if(typeof(arg1) == "string"){
      if(arg1[0] == "[" && arg1[arg1.length-1] == "]"){
        var attribute = arg1.substr(1, arg1.length-2);
        caa.push(attribute);
        car[attribute] = new KempoCustomAttribute(arg1, arg2);
        startObservingBody();
      } else {
        cer[arg1] = new KempoCustomElement(arg1, arg2);
      }
    }
    return Kempo;
  };
  
  /*
    Attach a variable to the library indicating its version, this will also hold the versions of all sub-modules
  */
  Kempo.version = {};
  Object.defineProperty(Kempo.version, "core", {
    get: function(){
      return '0.19.0';
    },
    set: function(){}, // read only
    enumerable: true, // can be enumerated
    configurable: false // can not be deleted/modified
  });

  /* Helper Function */
  function getAllChildrenFromNodeList(nl){
    var a = [];
    for(var i=0; i<nl.length; i++){
      if([3,7,8,10].indexOf(nl[i].nodeType) == -1){
        a.push(nl[i]);
        a = a.concat( getAllChildrenFromNodeList(nl[i].childNodes) );
      }
    }
    return a;
  }

  /* Custom Element Prototype */
  var KempoCustomElement = function(tag, options){
    this.added = function($element, attr, newVal){
      if(options.added) options.added.call($element, attr, newVal);
      if(options.changed && options.watch) watchForChanges($element);
    };
    this.removed = function($element, attr){
      if(options.removed) options.removed.call($element);
      if($element.observer){
        $element.observer.disconnect();
        delete $element.observer;
      }
    };
    function watchForChanges($element){
      var config = {};
      if(options.watch.attributes){
        config.attributes = true;
        config.attributeOldValue = true;
        if(options.watch.attributes instanceof Array)
          config.attributeFilter = options.watch.attributes;
      }
      if(options.watch.children){
        config.childList = true;
        config.subtree = true;
      }
      if(options.watch.text){
        config.childList = true;
        config.subtree = true;
        config.characterData = true;
        $element._oldInnerText = $element.innerText;
      }
      $element.observer = new MutationObserver(function(mutations){
        for(var i=0; i<mutations.length; i++){
          var m = mutations[i];
          if(options.watch && options.watch.attributes && m.type == "attributes"){
            options.changed.call(m.target, {
              attribute: {
                name: m.attributeName,
                oldValue: m.oldValue,
                newValue: m.target.getAttribute(m.attributeName)
              }
            });
          }
          if(options.watch && options.watch.children && m.type == "childList"){
            if(getAllChildrenFromNodeList(m.addedNodes).length){
              options.changed.call(m.target, {
                children: {
                  added: [].slice.call(m.addedNodes)
                }
              });
            }
            if(getAllChildrenFromNodeList(m.removedNodes).length){
              options.changed.call(m.target, {
                children: {
                  removed: [].slice.call(m.removedNodes)
                }
              });
            }
          }
          if(options.watch && options.watch.text && m.target._oldInnerText != m.target.innerText){
            options.changed.call(m.target, {
              text: {
                oldValue: m.target._oldInnerText,
                newValue: m.target.innerText
              }
            });
            m.target._oldInnerText = m.target.innerText;
          }
        }
      });
      $element.observer.observe($element, config);
    };
  };

  /* Custom Attribute Prototype */
  var KempoCustomAttribute = function(attribute, options){
    this.added = function($element, attr, newVal){
      if(options.added) options.added.call($element, attr, newVal);
    };
    this.removed = function($element, attr, oldVal){
      if(options.removed) options.removed.call($element, attr, oldVal);
    };
    this.changed = function($element, attr, oldVal, newVal){
      if(options.changed) options.changed.call($element, attr, oldVal, newVal);
    };
  };

  var cer = {}; // Custom Element Registry
  var car = {}; // Custom Attribute Registry
  var caa = []; // Custom Attribute Array

  var bodyObserver = new MutationObserver(function(mutations){
    for(var i=0; i<mutations.length; i++){
      var m = mutations[i];
      if(m.type == "attributes"){
        var attr = m.attributeName;
        var ca = car[attr];
        if(ca){
          var newVal = m.target.getAttribute(m.attributeName);
          if(m.attributeOldValue === null){
            ca.added(m.target, attr, newVal);
          } else if(newVal === null){
            ca.removed(m.target, attr, m.oldValue);
          } else {
            ca.changed(m.target, attr, m.oldValue, newVal);
          }
        }
      }
      if(m.type == "childList" && m.addedNodes.length){
        var an = getAllChildrenFromNodeList(m.addedNodes);
        for(var a in an){
          var ce = cer[an[a].tagName.toLowerCase()];
          if(ce){
            ce.added(an[a]);
          }
          for(var attr in car){
            if(an[a].getAttribute(attr) !== null){
              var ca = car[attr];
              if(ca){
                ca.added(an[a], attr, an[a].getAttribute(attr));
              }
            }
          }
        }
      }
      if(m.type == "childList" && m.removedNodes.length){
        var rn = getAllChildrenFromNodeList(m.removedNodes);
        for(var r in rn){
          if(!document.body.contains(rn[r])){// Make sure it is actually removed
            var ce = cer[rn[r].tagName.toLowerCase()];
            if(ce){
              ce.removed(rn[r]);
            }
          }
        }
      }
    }
  });
  function getBodyObserverConfig(){
    var bodyObserverConfig = {
      subtree: true,
      childList: true
    };
    if(caa.length){
      bodyObserverConfig.attributes = true;
      bodyObserverConfig.attributeOldValue = true;
      bodyObserverConfig.attributeFilter = caa;
    }
    return bodyObserverConfig;
  };
  function startObservingBody(){
    function observeBody(){
      if(startObservingBody.first){
        for(var tag in cer){
          var $ce = document.getElementsByTagName(tag);
          for(var i=0; i<$ce.length; i++){
            cer[tag].added($ce[i]);
          }
        }
        for(var attr in  car){
          // Custom Attribute Element
          var $cae = document.querySelectorAll("["+attr+"]");
          for(var i=0; i<$cae.length; i++){
            car[attr].added($cae[i], attr, $cae[i].getAttribute(attr));
          }
        }
        startObservingBody.first = false;
      }
      bodyObserver.disconnect();
      bodyObserver.observe(document.body, getBodyObserverConfig());
    }
    if(document.readyState == "complete") observeBody();
    else document.addEventListener("DOMContentLoaded", observeBody);
  };
  startObservingBody.first = true;
  startObservingBody();
  return Kempo;
})();
