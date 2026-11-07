/* Lightbox لصور الأعمال: ضغطة على الصورة تطلع كاملة. ملف مستقل، مش محتاج تعديل في script.js */
(function(){
  var box=document.createElement('div');
  box.className='lb';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
  box.innerHTML='<button type="button" class="lb-x" aria-label="Close">&times;</button>'+
    '<button type="button" class="lb-prev" aria-label="Previous">&#8249;</button>'+
    '<button type="button" class="lb-next" aria-label="Next">&#8250;</button>'+
    '<figure><img alt=""><figcaption></figcaption></figure><span class="lb-count"></span>';
  document.body.appendChild(box);
  var img=box.querySelector('img'),cap=box.querySelector('figcaption'),count=box.querySelector('.lb-count');
  var list=[],idx=0,lastFocus=null;

  function shots(){
    return Array.prototype.filter.call(document.querySelectorAll('.tile'),function(t){return !t.hidden})
      .map(function(t){return t.querySelector('img.shot')})
      .filter(function(i){return i&&!i.hidden&&i.getAttribute('src')});
  }
  function captionOf(i){
    var b=i.closest('.tile').querySelector('.cap b');
    if(!b)return i.alt||'';
    var lang=(document.getElementById('app')||document.documentElement).dataset.l||'ar';
    var s=b.querySelector('.'+lang);return (s||b).textContent;
  }
  function show(n){
    idx=(n+list.length)%list.length;
    var i=list[idx];
    img.src=i.currentSrc||i.src;img.alt=captionOf(i);cap.textContent=captionOf(i);
    count.textContent=(idx+1)+' / '+list.length;
    var multi=list.length>1;
    box.querySelector('.lb-prev').hidden=!multi;box.querySelector('.lb-next').hidden=!multi;
  }
  function open(i){
    list=shots();idx=list.indexOf(i);if(idx<0){list=[i];idx=0}
    lastFocus=document.activeElement;
    show(idx);box.classList.add('open');document.body.classList.add('lb-lock');
    box.querySelector('.lb-x').focus();
  }
  function close(){
    box.classList.remove('open');document.body.classList.remove('lb-lock');img.removeAttribute('src');
    if(lastFocus&&lastFocus.focus)lastFocus.focus();
  }

  document.addEventListener('click',function(e){
    var i=e.target.closest&&e.target.closest('.tile img.shot');
    if(i&&!i.hidden){e.preventDefault();open(i)}
  });
  /* الكيبورد: Enter على الصورة يفتحها */
  document.addEventListener('keydown',function(e){
    if(!box.classList.contains('open')){
      var t=e.target;
      if((e.key==='Enter'||e.key===' ')&&t.matches&&t.matches('.tile img.shot')){e.preventDefault();open(t)}
      return;
    }
    if(e.key==='Escape')close();
    else if(e.key==='ArrowRight')show(idx+1);
    else if(e.key==='ArrowLeft')show(idx-1);
    else if(e.key==='Tab'){   /* خلي التركيز جوه النافذة */
      var f=box.querySelectorAll('button:not([hidden])'),first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
  box.addEventListener('click',function(e){
    if(e.target===box||e.target.closest('figure')===null&&e.target.classList.contains('lb-count'))close();
    else if(e.target.closest('.lb-x'))close();
    else if(e.target.closest('.lb-prev'))show(idx-1);
    else if(e.target.closest('.lb-next'))show(idx+1);
  });
  /* السحب على الموبايل */
  var sx=null;
  box.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
  box.addEventListener('touchend',function(e){
    if(sx==null||list.length<2)return;
    var dx=e.changedTouches[0].clientX-sx;sx=null;
    if(Math.abs(dx)>50)show(dx<0?idx+1:idx-1);
  });

  /* خلي الصور تتفتح بالكيبورد */
  function prep(){document.querySelectorAll('.tile img.shot').forEach(function(i){i.tabIndex=0;i.setAttribute('role','button')})}
  prep();setTimeout(prep,0);
})();
