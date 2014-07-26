(function(window, $) {
  if ( window.Forgejs !== undefined ) { 
    return; 
  }
  window.Forgejs = function(){

    // add panel
    var $forgePanel = $('<div/>').addClass('forge-right')
    var $forgeButton1 = $('<button/>').addClass('forge-btn')
    $forgeButton1.text("forge")
    $forgePanel.append($forgeButton1)
    var $forgeButton2 = $('<button/>').addClass('forge-btn')
    $forgeButton2.text("close")
    $forgePanel.append($forgeButton2)

    $forgeButton1.click(function( event ){
      event.stopPropagation()
      // print data
      $('.overhight').each( function( index, element ){
        var $item = $(this).data('highlighted')
        $item.attr('style', $item.attr('style') + $(this).data('style'))
        console.log($item.get(0))
      })

      forgeClose()
      forgeStart()
    })

    $forgeButton2.click(function( event ){
      event.stopPropagation()
      forgeClose()
    })

    $('body').append($forgePanel)

    forgeClose = function(){
      $('.background-overlay').remove()
      $('.overlay').remove()
      $('.highlight').removeClass('highlight')
      $('.highlighted').removeClass('highlighted')
      $('.overlayed').remove()
      $('.overhight').remove()
      $('#highlight-close').remove()
    } 

    forgeStart = function(){

      removeElement = undefined
      preElement = undefined
      $close = $("<div/>").attr('id', 'highlight-close').text('×')
      $overlay = $("<div/>").addClass('overlay')
      hideClose = function(){
        $close.css('top', '-50px')
        $close.css('left', '-50px')
      }
      hideOverlay = function(){
        $overlay.offset({
          top: -50,
          left: -50
        })
        $overlay.css({'width': '0', 'height': '0'})
      }

      $( "body" ).mousemove(function( event ) {
        $target = $(event.target)

      	if (preElement !== undefined && preElement !== event.target && !($target.hasClass('highlighted'))
          && ($target.attr('id') != 'highlight-close') && !$target.hasClass('overhight')
          && !$target.hasClass('forge-right')) {
          $overlay.offset($target.offset())
          $overlay.width($target.width())
          $overlay.height($target.height())
          $(preElement).removeClass('highlight')
          $target.addClass('highlight')
          hideClose()
        }

        if ($target.hasClass('overhight')){
          var left = (parseInt($target.offset().left, 10) +  parseInt($target.width(), 10));
          left = Math.max( left, 10 );
          left = Math.min( left, window.innerWidth - 15 );
          var top = (parseInt($target.offset().top, 10));
          top = Math.max( top, 10 );

          $close.offset({
            top: top - 5,
            left: left - 5
          })
          removeElement = $target
          hideOverlay()
        }

        if (preElement === undefined){
          $(event.target)
          
          $overlay.offset($target.offset())
          $overlay.width($target.width())
          $overlay.height($target.height())
          $('body').append($overlay)
          $target.addClass('highlight')
        }
        preElement = $target.get(0)  
      });

      $("body").click(function( event ){
        event.preventDefault();

        if ($target.hasClass('overhight') || $target.attr('id') == 'highlight-close'){
          return 0;
        }
        $target.removeClass('highlight')
        
        hideOverlay()

        var $overlayed = $("<div/>").addClass('overlayed')
        $overlayed.offset($target.offset())
        $overlayed.width($target.width())
        $overlayed.height($target.height())
        $('body').append($overlayed)
        $target.addClass('highlighted')
        
        $overhight = $('<div/>').addClass('overhight')
        $overhight.offset($target.offset())
        $overhight.width($target.width())
        $overhight.height($target.height())
        $('body').append($overhight)

        $overhight.data('overlayed', $overlayed)
        $overhight.data('highlighted', $target)
        $overhight.data('style', css($target.get(0)))
      })

      $close.click(function( event ){
        event.stopPropagation()
        if (removeElement){
          removeElement.data('overlayed').remove()
          removeElement.data('highlighted').removeClass('highlighted')
          removeElement.remove()
          removeElement = null
          hideClose()
        }
      })

      $('body').append($("<div/>").addClass('background-overlay'))
      $('body').append($close)
      
      hideClose()
    }

    // from: http://stackoverflow.com/questions/2952667/find-all-css-rules-that-apply-to-an-element
    function css(a) {
      var sheets = document.styleSheets, o = [];
      a.matches = a.matches || a.webkitMatchesSelector || a.mozMatchesSelector || a.msMatchesSelector || a.oMatchesSelector;
      for (var i in sheets) {
          var rules = sheets[i].rules || sheets[i].cssRules;
          for (var r in rules) {
              if (rules[r].selectorText != '.highlighted' && a.matches(rules[r].selectorText)) {
                  console.log(String(rules[r].cssText))
                  o.push(rules[r].cssText.match(/{(.*)}/)[1]);
              }
          }
      }
      console.log(o)
      return o.join('');
    }

  }

})(window, $);