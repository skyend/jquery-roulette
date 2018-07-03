(function ($) {

  $.fn.skyRoulette = function (options) {
    /**
     * Option variables
     */
    var rotationPerSec = options.speed || 4;
    var shuffle = options.shuffle | false;
    var stopPartIndex = options.stopPartIndex || 0;
    var fps = options.fps || 30;

    /**
     * Internal variable
     */
    var target = this;
    var $pane = this.find('.sky-roulette-pane');
    var $partitions = $pane.find('.sky-roulette-part');
    var partWidth = $partitions.width()
    var partCount = $partitions.length;
    var paneWidth = partWidth * partCount;
    var stopRotationPerSec = 0.5 - 1 / partCount * stopPartIndex;
    var vrotationPerSec = rotationPerSec;

    /**
     * Setting Pane
     */
    $pane.width(paneWidth);
    $pane.css('overflow', 'hidden');

    console.log('r', stopRotationPerSec)
    /**
     * Shuffle
     */
    var parts = Array.apply(null, $partitions);
    var originParts = parts;
    if (shuffle) {
      parts = procShuffle(parts);
    }
    var shuffleResult_DEBUG = parts.map(function (p) {
      return p.getAttribute('data-part-id')
    });
    // shuffle result
    // console.log(shuffleResult_DEBUG)


    /**
     * Ready
     */
    render(0);

    start();


    /**
     * Time
     */
    var startTime = Date.now();
    var currentTime = null;
    var elapseTime = 0;
    var prevSectionElapse;
    var rotationSectionDuration;
    var sectionElapseTime;
    var factorA;
    var stopTarget = originParts[stopPartIndex];

    function start() {


      /**
       * Loop
       */
      var loop = setInterval(function () {
        currentTime = Date.now();

        elapseTime = currentTime - startTime;
        rotationSectionDuration = 1000 / vrotationPerSec;
        sectionElapseTime = elapseTime % (rotationSectionDuration);
        factorA = sectionElapseTime / rotationSectionDuration;



        render(elapseTime);

        var half = rotationPerSec / 2;
        if (vrotationPerSec < Math.floor(half) + stopRotationPerSec) {


          if( stopTarget._x > ( paneWidth / 2 - partWidth / 2 ) && stopTarget._x < ( paneWidth / 2 + partWidth / 2 ) ){
            clearInterval(loop)
          }

        } else {
          vrotationPerSec *= 0.995;
        }

        prevSectionElapse = sectionElapseTime;

        // if( elapseTime > 1000 * 990 ) clearInterval(loop)
      }, 1000 / fps);
    }

    /**
     * Render
     * @param elapseTime
     */
    function render(elapseTime) {

      var len = parts.length;

      // console.log(sectionElapseTime, rotationSectionDuration)

      // vrotationPerSec = (vrotationPerSec + (stopvrotationPerSec - vrotationPerSec ) * 0.7 )

      // this.vx = (this.vx+ (tx- this._x)/accel)/slow;

      // console.log(vrotationPerSec)

      var cur, x;
      var factorB;
      for (var i = 0; i < parts.length; i++) {
        factorB = i / len;
        cur = parts[i];
        x = (factorA + factorB) * paneWidth;


        if (x > paneWidth) {
          x = x - paneWidth
        }
        // console.log(factorA, factorB, x, '1')
        cur.style.transform = 'translatex(' + x + 'px)';
        cur._x = x;
        // cur.style.transition = 'transform 0.01666s';

      }
    }

    /**
     * Shuffle
     * @param arr
     * @returns {Array}
     */
    function procShuffle(arr) {
      var length = arr.length;
      var newArr = [];
      var pickedIndex = [];
      while (length !== newArr.length) {
        var r = Math.floor(Math.random() * length);
        // console.log(r, pickedIndex)
        if (pickedIndex.find(function (i) {
          return i === r
        }) !== undefined) {
          // console.log('con')
          continue;
        }

        newArr.push(arr[r]);
        pickedIndex.push(r);
      }

      return newArr;
    }

    return {
      start: start,
    }
  }


})(jQuery);
