(function(){
  var MAIL='rawancoding1272007@gmail.com',WA='201035193743';
  /* ====== صور أعمال الشركة ======
     حطي الصورة في فولدر assets/works/ واكتبي مسارها بين علامتي التنصيص في img.
     مثال: img:'assets/works/brand1.jpg'
     الترتيب: الأول = أول كارت. لإضافة عمل جديد أضيفي سطر جديد بنفس الشكل.
     c = القسم: gfx جرافيك | web مواقع | vid مونتاج | mkt تسويق | ai ذكاء اصطناعي */
  var PORTFOLIO=[
    {c:'gfx',ar:'هوية بصرية وشعار',en:'Brand identity and logo',img:'فكره كريتيف-01.png'},
    {c:'gfx',ar:'منشورات سوشيال ميديا',en:'Social media posts',img:'قطعه 302.jpeg'},
    {c:'gfx',ar:'منشورات سوشيال ميديا',en:'Social media posts',img:'قطعه 267.jpeg'},
    {c:'gfx',ar:'منشورات سوشيال ميديا',en:'Social media posts',img:'قطعه 396.jpeg'},
    {c:'gfx',ar:'منشورات سوشيال ميديا',en:'Social media posts',img:'قطعه 829.jpeg'},
    {c:'web',ar:'موقع شركة وLanding Page',en:'Company site and landing page',img:'ويب سايت.png'},
    {c:'vid',ar:'فيديو إعلاني وموشن',en:'Ad video and motion',img:''},
    {c:'mkt',ar:'خطة محتوى لحملة',en:'Campaign content plan',img:'ماركتنج.jpeg'},
    {c:'ai',ar:'محتوى بصري بالذكاء الاصطناعي',en:'AI-generated visual content',img:''}
  ];

  var app=document.getElementById('app');
  function $(id){return document.getElementById(id)}
  function el(tag,cls,txt){var n=document.createElement(tag);if(cls)n.className=cls;if(txt!=null)n.textContent=txt;return n}

  var T={
    ar:{copied:'تم النسخ',needName:'اكتب اسمك',needContact:'اكتب رقم الهاتف أو البريد الإلكتروني',needDesc:'اكتب وصفًا مختصرًا للمشروع',badMail:'البريد الإلكتروني غير صحيح',
      sub:'طلب خدمة جديد: على الجاهز',
      blocked:'المتصفح منع فتح الرابط. تم نسخ الطلب، افتح واتساب أو جيميل وألصقه.',
      needFb:'اكتب رأيك الأول',anon:'عميل',fbMsg:'رأي جديد في على الجاهز:',fbSub:'رأي جديد في على الجاهز',
      sum:{h:'طلب خدمة جديد: على الجاهز',n:'الاسم',p:'الهاتف',e:'البريد',c:'الشركة/المشروع',s:'الخدمة',b:'الميزانية',d:'الموعد المطلوب',f:'الوصف',fl:'ملفات مرجعية (هرفقها)'}},
    en:{copied:'Copied',needName:'Enter your name',needContact:'Enter a phone number or an email',needDesc:'Add a short project description',badMail:'The email address looks wrong',
      sub:'New service request: 3al Gahiz',
      blocked:'Your browser blocked the link. The text was copied. Open WhatsApp or Gmail and paste it.',
      needFb:'Write your feedback first',anon:'Client',fbMsg:'New feedback for 3al Gahiz:',fbSub:'New feedback for 3al Gahiz',
      sum:{h:'New service request: 3al Gahiz',n:'Name',p:'Phone',e:'Email',c:'Company/Project',s:'Service',b:'Budget',d:'Needed by',f:'Description',fl:'Reference files (I will attach)'}}
  };
  var lang='ar';
  try{var s=localStorage.getItem('oeg-lang');if(s==='en'||s==='ar')lang=s}catch(e){}

  function optLabel(selId,val){
    var sel=$(selId),o=sel.querySelectorAll('option');
    for(var i=0;i<o.length;i++)if(o[i].value===val)return o[i].getAttribute('data-'+lang);
    return val;
  }
  function setLang(l){
    lang=l;app.dataset.l=l;app.dir=l==='ar'?'rtl':'ltr';
    var sel=app.querySelectorAll('option[data-ar]');
    for(var i=0;i<sel.length;i++)sel[i].textContent=sel[i].getAttribute('data-'+l);
    try{localStorage.setItem('oeg-lang',l)}catch(e){}
    if(!$('result').hidden)buildSummary();
    if(!$('fbSend').hidden)buildFeedback();
  }
  $('langBtn').addEventListener('click',function(){setLang(lang==='ar'?'en':'ar')});

  var nav=$('nav'),burger=$('burger');
  burger.addEventListener('click',function(){var o=nav.classList.toggle('open');burger.setAttribute('aria-expanded',o)});
  nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('open');burger.setAttribute('aria-expanded','false')}});

  var tabs=$('tabs');
  tabs.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var f=b.dataset.f;
    tabs.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    document.querySelectorAll('.tile').forEach(function(t){t.hidden=!(f==='all'||t.dataset.c===f)});
  });
  document.querySelectorAll('[data-plan]').forEach(function(a){
    a.addEventListener('click',function(){$('fService').value=a.dataset.plan});
  });

  /* ---------- نسخ ---------- */
  function copyPlain(txt){
    try{if(navigator.clipboard&&navigator.clipboard.writeText)return navigator.clipboard.writeText(txt)}catch(e){}
    var ta=document.createElement('textarea');ta.value=txt;ta.style.cssText='position:fixed;opacity:0';
    document.body.appendChild(ta);ta.select();try{document.execCommand('copy')}catch(e){}ta.remove();
    return Promise.resolve();
  }
  function copyText(txt,btn){
    var o=btn.innerHTML;
    copyPlain(txt).then(function(){btn.textContent=T[lang].copied;setTimeout(function(){btn.innerHTML=o},1600)});
  }
  document.querySelectorAll('[data-copy]').forEach(function(b){
    b.addEventListener('click',function(){copyText($(b.dataset.copy).textContent,b)});
  });

  /* ---------- فتح واتساب / جيميل ---------- */
  function openExternal(url){
    var w=null;
    try{w=window.open(url,'_blank','noopener')}catch(e){}
    if(w)return true;
    try{window.top.location.href=url;return true}catch(e){}
    try{window.location.href=url;return true}catch(e){}
    return false;
  }
  function toast(id,ms){var t=$(id);t.hidden=false;setTimeout(function(){t.hidden=true},ms||8000)}

  /* ---------- طلب الخدمة ---------- */
  var form=$('reqForm');
  function val(id){return $(id).value.trim()}
  function setErr(id,m){var e=form.querySelector('.err[data-for="'+id+'"]');if(e)e.textContent=m||''}
  function fileNames(){var f=$('fFiles').files,n=[];for(var i=0;i<f.length;i++)n.push(f[i].name);return n}
  function buildSummary(){
    var t=T[lang].sum,names=fileNames();
    var lines=[t.h,'',
      t.n+': '+val('fName'),
      t.p+': '+(val('fPhone')||'-'),
      t.e+': '+(val('fEmail')||'-'),
      t.c+': '+(val('fCompany')||'-'),
      t.s+': '+optLabel('fService',$('fService').value),
      t.b+': '+optLabel('fBudget',$('fBudget').value),
      t.d+': '+(val('fDate')||'-'),
      t.f+': '+val('fDesc')];
    if(names.length)lines.push(t.fl+': '+names.join(', '));
    var text=lines.join('\n');
    $('summary').textContent=text;
    $('sendWa').href='https://wa.me/'+WA+'?text='+encodeURIComponent(text);
    $('sendMail').href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(MAIL)+'&su='+encodeURIComponent(T[lang].sub)+'&body='+encodeURIComponent(text);
    $('sendMailto').href='mailto:'+MAIL+'?subject='+encodeURIComponent(T[lang].sub)+'&body='+encodeURIComponent(text);
    return text;
  }
  function resetRequest(){
    setTimeout(function(){
      form.reset();
      ['fName','fPhone','fEmail','fDesc'].forEach(function(i){setErr(i,'')});
      $('result').hidden=true;$('extErr').hidden=true;
      toast('sentToast');
    },700);
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true,m=T[lang];
    ['fName','fPhone','fEmail','fDesc'].forEach(function(i){setErr(i,'')});
    if(!val('fName')){setErr('fName',m.needName);ok=false}
    if(!val('fPhone')&&!val('fEmail')){setErr('fPhone',m.needContact);ok=false}
    if(val('fEmail')&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val('fEmail'))){setErr('fEmail',m.badMail);ok=false}
    if(!val('fDesc')){setErr('fDesc',m.needDesc);ok=false}
    if(!ok)return;
    buildSummary();
    var r=$('result');r.hidden=false;r.scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $('copyReq').addEventListener('click',function(){copyText($('summary').textContent,this)});

  /* ---------- الرأي (فيدباك) ---------- */
  var fbForm=$('fbForm');
  function starStr(n){var r='';for(var i=1;i<=5;i++)r+=i<=n?'\u2605':'\u2606';return r}
  function buildFeedback(){
    var x=T[lang],name=$('fbName').value.trim()||x.anon,rating=+$('fbRate').value,text=$('fbText').value.trim();
    var body=x.fbMsg+'\n'+name+' '+starStr(rating)+'\n'+text;
    $('fbWa').href='https://wa.me/'+WA+'?text='+encodeURIComponent(body);
    $('fbMail').href='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent(MAIL)+'&su='+encodeURIComponent(x.fbSub)+'&body='+encodeURIComponent(body);
    return body;
  }
  fbForm.addEventListener('submit',function(e){
    e.preventDefault();
    var err=$('fbfErr');err.textContent='';$('fbDone').hidden=true;
    if(!$('fbText').value.trim()){err.textContent=T[lang].needFb;return}
    buildFeedback();$('fbSend').hidden=false;
  });
  function finishFeedback(){
    setTimeout(function(){
      fbForm.reset();$('fbSend').hidden=true;$('fbfErr').textContent='';
      toast('fbDone');
    },700);
  }

  /* ---------- الضغط على أزرار الإرسال ---------- */
  function onExtClick(e){
    var a=e.currentTarget,id=a.id;
    var isFb=(id==='fbWa'||id==='fbMail');
    var body=null;
    if(id==='sendWa'||id==='sendMail')body=buildSummary();
    if(isFb)body=buildFeedback();
    var url=a.href;
    e.preventDefault();
    var opened=openExternal(url);
    if(opened){
      if(id==='sendWa'||id==='sendMail')resetRequest();
      if(isFb)finishFeedback();
    }else if(body!=null){
      var box=isFb?$('fbfErr'):$('extErr');
      box.hidden=false;box.textContent=T[lang].blocked;
      copyPlain(body);
    }
  }
  document.querySelectorAll('a[data-ext]').forEach(function(a){a.addEventListener('click',onExtClick)});
  $('sendMailto').addEventListener('click',function(){buildSummary();resetRequest()});

  /* ---------- public portfolio images ---------- */
  (function(){
    var tiles=document.querySelectorAll('.tile'),n0=tiles.length,work=document.querySelector('.work'),all=true;
    PORTFOLIO.forEach(function(p,i){
      if(i>=n0&&!p.img)return;
      var t=tiles[i];
      if(!t){t=tiles[0].cloneNode(true);work.appendChild(t)}
      if(p.c)t.dataset.c=p.c;
      var im=t.querySelector('img.shot'),sv=t.querySelector('svg');
      if(p.img){im.src=p.img;im.alt=p.en||p.ar||'';im.removeAttribute('hidden');sv.setAttribute('hidden','')}
      else if(i<n0)all=false;
      if(p.ar||p.en){
        var b=t.querySelector('.cap b');b.textContent='';
        var a=el('span','ar',p.ar||p.en),e=el('span','en',p.en||p.ar);b.appendChild(a);b.appendChild(e);
      }
    });
    if(all){var fn=document.querySelector('.foot-note');if(fn)fn.hidden=true}
  })();

  setLang(lang);
})();
