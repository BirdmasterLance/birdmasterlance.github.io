
//lib
l=function(d){return document.getElementById(d);};
c=function(a){return a[Math.floor(Math.random()*a.length)];};

shuffle=function(a){
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

/*String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};*/

String.prototype.replaceAll=function(search,replacement)
{return this.split(search).join(replacement);};

rand=function()
{
	if (arguments.length==2) return Math.floor(Math.random()*(arguments[1]-arguments[0])+arguments[0]);
	else return Math.floor(Math.random()*arguments[0]);
};
frand=function()
{
	if (arguments.length==2) return (Math.random()*(arguments[1]-arguments[0])+arguments[0]);
	else return (Math.random()*arguments[0]);
};

addEvent=function(html_element,event_name,event_function)
{
	return html_element.addEventListener(event_name,event_function,false);
};
triggerAnim=function(element,anim)
{
	if (!element) return;
	element.classList.remove(anim);
	void element.offsetWidth;
	element.classList.add(anim);
};

cloneDom=function(el)
{
	//return a clone of el with all IDs stripped
	var alias=el.cloneNode();
	alias.innerHTML=el.innerHTML;
	alias.removeAttribute('id');
	var elems=alias.getElementsByTagName('*');for (var i=0;i<elems.length;i++){elems[i].removeAttribute('id');}
	return alias;
}


SmoothToggles=function()
{
	let calibrator=document.createElement('div');
	document.body.appendChild(calibrator);
	animAdd=function(el)
	{
		var alias=cloneDom(el);
		calibrator.appendChild(alias);
		el.classList.add('beingAdded');
		let h=alias.offsetHeight;
		alias.remove();
		el.style.height=h+'px';
		setTimeout(function(){if (el){el.classList.remove('beingAdded');el.style.removeProperty('height');}},100);
	}
	animRemove=function(el)
	{
		var alias=cloneDom(el);
		calibrator.appendChild(alias);
		let h=alias.offsetHeight;
		alias.remove();
		el.style.height=h+'px';
		void el.offsetWidth;
		el.classList.add('beingRemoved');
		el.style.height='0px';
		setTimeout(function(){if (el){el.remove();}},250);
	}
}();


//dubious reliability
STRCLN=function(str)
{
	str=str.toString();
	str=str.replaceAll('<','&lt;');
	str=str.replaceAll('>','&gt;');
	str=str.replaceAll('\'','&#39;');
	str=str.replaceAll('"','&#34;');
	return str;
};
INTCLN=function(str)
{
	str=parseInt(str);
	return str;
}




G={
	init:function()
	{
		G.launched=true;

		G.popup=function(text,func)
		{
			var str=`
				<div class="darken" id="darken"></div>
				<div class="popup box" id="popup">${text}<div><div id="closePopup" class="button bigButton">Close</div></div></div>
			`;
			l('popups').innerHTML=str;
			addEvent(l('darken'),'click',G.closePopup);
			addEvent(l('closePopup'),'click',G.closePopup);
			if (func) func();
			//animAdd(l('popup'));
		}
		G.closePopup=function()
		{
			if (l('popup'))
			{
				l('popups').innerHTML='';
				//animRemove(l('popup'));
			}
		}
		addEvent(document,'keydown',function(e){if (e.key=='Escape'){G.closePopup();}});
		
		G.glob={};
		//perks
		
		G.perks=[];
		G.perksBN=[];
		G.perk=function(o)
		{
			for (var i in G.glob){this[i]=G.glob[i];}
			for (var i in o){this[i]=o[i];}
			this.id=G.perks.length;
			G.perks.push(this);
			G.perksBN[this.name]=this;
		}
		
		G.glob={type:'trait',def:true};
		new G.perk({name:`no perk`,desc:`No perk selected.`});
		new G.perk({name:`leader`,desc:`Capable of bringing people together to accomplish great deeds.`});
		new G.perk({name:`peaceful`,desc:`Has no interest in violence.`});
		new G.perk({name:`sociopath`,desc:`Will lie, steal and kill at a moment's notice.`});
		new G.perk({name:`kind`,desc:`Will act selflessly and generously to help others.`});
		new G.perk({name:`unstable`,desc:`May snap at any moment.`});
		new G.perk({name:`bulky`,desc:`Capable of both delivering and resisting stronger attacks.`});
		new G.perk({name:`meek`,desc:`Very fragile and physically inept.`});
		new G.perk({name:`naive`,desc:`Gullible and easy to mislead.`});
		new G.perk({name:`devious`,desc:`Will manipulate and betray others if given the chance.`});
		//new G.perk({name:`seductive`,desc:`Capable of romancing others into doing their bidding.`});
		//new G.perk({name:`suicidal`,desc:`Probably won't survive very long.`});
		new G.perk({name:`cute`,desc:`Everybody likes them! Others may go out of their way to protect them.`});
		new G.perk({name:`annoying`,desc:`Horrible to be around. Tends to get killed off first.`});
		new G.perk({name:`scrappy`,desc:`Finds more resources than most.`});
		new G.perk({name:`survivalist`,desc:`Strives better alone, and will not let others get in their way.`});
		new G.perk({name:`rich`,desc:`Armed with a large fortune to cater every whim.`});
		new G.perk({name:`inventor`,desc:`Can devise strange machines for various purposes.`});
		//new G.perk({name:`goth`,desc:`Channels the dark energies.`});
		new G.perk({name:`lunatic`,desc:`Susceptible to gain and lose random perks regularly.`});
		new G.perk({name:`volleyball freak`,desc:`Loves volleyball.`});
		new G.perk({name:`fighter`,desc:`Loves to fight.`});
		
		G.glob={type:'status'};
			G.glob.disable=true;//mark the character as disabled; disabled characters cannot do any actions that don't specifically call for this perk
			G.glob.out=false;//mark the character as out; out characters cannot do any actions that don't specifically call for this perk
		new G.perk({name:`frenzied`,desc:`Experiencing a fit of violent rage.`});
		new G.perk({name:`shell-shocked`,desc:`Has seen too much. May not be of much use for a while.`});
		new G.perk({name:`dazed`,desc:`Not quite in full control of their faculties. May wander off unpredictably.`});
		new G.perk({name:`heroic`,desc:`Having a moment of heroism. Resolved and unstoppable.`});
		new G.perk({name:`terrified`,desc:`Running away from somethig horrifying.`});
		new G.perk({name:`has killed`,desc:`Caused someone's death.`,disable:false});
		new G.perk({name:`set trap`,desc:`Laid down some traps that others may get caught in...`,disable:false});
		new G.perk({name:`set landmine`,desc:`Laid down a landmine that others might trigger...`,disable:false});
		
		new G.perk({name:`scratched`,desc:`Lightly scratched and bleeding a little bit.`,disable:false});
		new G.perk({name:`bruised`,desc:`Been pounded badly.`,disable:false});
		new G.perk({name:`cut up`,desc:`Received some slicing damage.`,disable:false});
		new G.perk({name:`burnt`,desc:`Singed quite a lot. Everything hurts.`});
		new G.perk({name:`bleeding out`,desc:`Losing blood at an alarming rate. Needs immediate treatment.`});
		new G.perk({name:`poisoned`,desc:`Slowly dying due to poison.`});
		new G.perk({name:`badly poisoned`,desc:`Bloodstream saturated with poison; will most likely die soon.`});
		new G.perk({name:`missing leg`,desc:`Missing a whole leg!`});
		new G.perk({name:`missing arm`,desc:`Missing a whole arm!`});
		new G.perk({name:`trapped`,desc:`Stuck in a trap, and waiting to be freed, if something doesn't kill them first.`});
		new G.perk({name:`comatose`,desc:`Unconscious, and unable to speak or move.`,out:true});
		new G.perk({name:`revived`,desc:`Was just resurrected through some miracle or other.`,out:true});
		new G.perk({name:`dead`,desc:`Dead and gone. Sorry!`,out:true});
		new G.perk({name:`ghost`,desc:`Brought back from the dead in a mischievous incorporeal form.`,out:true});
		new G.perk({name:`zombie`,desc:`Brought back from the dead in a smelly, mindless form.`,out:true});
		new G.perk({name:`sheep`,desc:`Has been turned into a sheep through some magical mean.`,out:true});
		
		G.glob={type:'item'};
			G.glob.def=true;
		new G.perk({name:`no item`,desc:`No item selected.`});
		
		new G.perk({name:`big stick`,desc:`Rather crude, but can bash an unsuspecting enemy just fine.`});
		new G.perk({name:`pitchfork`,desc:`Used to stack hay and stab your friends.`});
		new G.perk({name:`sword`,desc:`A classic bladed weapon popular since medieval times.`});
		new G.perk({name:`axe`,desc:`Makes quick, if messy work of anyone who'd stand in your way.`});
		new G.perk({name:`handgun`,desc:`Takes down a target quite reliably if you know how to aim.`});
		new G.perk({name:`shotgun`,desc:`Delivers a powerful, low-accuracy blow.`});
		new G.perk({name:`grenade`,desc:`A single-use explosive device to blow several enemies to bits.`});
		new G.perk({name:`slingshot`,desc:`Fires small projectiles. Not quite deadly as much as slightly annoying.`});
		new G.perk({name:`bow`,desc:`Its arrows can easily chop a head clean off from a distance if skillfully wielded.`});
		new G.perk({name:`flamethrower`,desc:`Careful! May set both foes and friends on fire.`});
		new G.perk({name:`rocket launcher`,desc:`A dangerous weapon; excels at blowing stuff up.`});
		new G.perk({name:`lasergun`,desc:`Ultra-concentrated energy shots that burn through practically anything.`});
		new G.perk({name:`magic wand`,desc:`Casts a variety of spells upon your foes.`});
		new G.perk({name:`ancient scepter`,desc:`Calls forth ancient hexes and curses on your adversaries.`});

		// Custom items
		new G.perk({name:`volleyball`,desc:`An ordinary volleyball.`});
		new G.perk({name:`knives`,desc:`For stabbing or throwing.`});
		
		new G.perk({name:`pet wolf`,desc:`A ravenous pet wolf to devour your opponents.`});
		new G.perk({name:`pet tiger`,desc:`A fierce pet tiger to tear your opponents to shreds.`});
		new G.perk({name:`pet turtle`,desc:`A steady pet turtle to slowly but surely win the race.`});
		
		new G.perk({name:`wish ring`,desc:`Will unpredictably respond to wishes in dire situations.`});
		
			G.glob.def=false;
		//new G.perk({name:`leather scraps`,desc:`Tribal-looking clothing. Provides minimal protection.`});
		//new G.perk({name:`bikini`,desc:`Quite alluring, but not much help in combat situations.`});
		new G.perk({name:`dapper suit`,desc:`Turns anyone into a snappy dresser.`});
		new G.perk({name:`parka`,desc:`Keeps you protected from the elements and, you suppose, some of the wimpier physical attacks.`});
		new G.perk({name:`knight armor`,desc:`Excellent physical protection, but heavy and uncomfortable.`});
		new G.perk({name:`combat gear`,desc:`Used by military forces. Provides near-perfect protection from all but the deadliest attacks.`});
		new G.perk({name:`wizard robe`,desc:`Can greatly amplify magic powers. Comes with a pointy hat.`});

		// Custom hidden items
		new G.perk({name:`landmine`,desc:`An explosive trap.`});
		
		
		//creator
		G.setupData=0;
		G.creator=function()
		{
			G.roundLog=[];
			G.importedGame=false;
			G.exportSetup=function(data)
			{
				var o={
					teams:[],
					chars:[],
				};
				if (data && data!=-1)
				{
					o=data;
				}
				else
				{
					var teams=G.teams;
					for (var i in teams)
					{
						var base=teams[i];
						if (!base.teamless) base.name=l(base.l.id+'-name').value; else base.name='NOTEAM';
						for (var i in base.members)
						{
							var member=base.members[i];
							member.name=l(member.l.id+'-name').value;
							member.gender=parseInt(l(member.l.id+'-gender').options[l(member.l.id+'-gender').selectedIndex].value);
							member.tier=parseInt(l(member.l.id+'-tier').options[l(member.l.id+'-tier').selectedIndex].value);
							var val=member.pic;
							if (val.length<3) member.pic='';
							var perks=[];
							var perkN=0;
							while (l(member.l.id+'-perk-'+perkN))
							{
								var el=l(member.l.id+'-perk-'+perkN);
								var perk=G.perks[el.options[el.selectedIndex].value];
								if (perk.name!='no perk' && perk.name!='no item' && (perk.type!='trait' || perks.indexOf(perk.name)==-1)) perks.push(perk.name);
								perkN++;
							}
							o.chars.push({name:member.name,g:member.gender,t:member.tier,pic:member.pic,team:member.team.name,perks:perks});
						}
						o.teams.push({name:base.name});
					}
				}
				if (data!=-1)
				{
					var str=`
						<header>Exporting setup</header>
						<div>Copy this text. You can later import your setup by pasting this back in the import menu.</div>
						<textarea id="textareaPrompt" style="width:100%;height:128px;" readonly>${JSON.stringify(o)}</textarea>
					`;
					G.popup(str,function(){
						l('textareaPrompt').focus();
						l('textareaPrompt').select();
					});
					
					//localStorage.setItem('murderGames',JSON.stringify(o));
				}
				else return o;
			}
			G.importSetup=function(str)
			{
				//meant to be called from creator screen only
				
				if (!str)
				{
					var str=`
						<header>Importing setup</header>
						<div style="overflow:hidden;"><div id="importDesc">Paste in the text you were given on setup export.</div></div>
						<textarea id="textareaPrompt" style="width:100%;height:128px;"></textarea>
					`;
					G.popup(str,function(){
						l('textareaPrompt').focus();
						l('closePopup').innerHTML='Cancel';
						l('closePopup').insertAdjacentHTML('beforebegin','<div id="confirmPopup" class="button bigButton">Load</div>');
						addEvent(l('confirmPopup'),'click',function(){
							var str=l('textareaPrompt').value;
							if ((str.length>0) && G.importSetup(str)) G.closePopup();
							else {l('importDesc').innerHTML=`<span style="color:#e2461f;">Looks like that's not a valid setup string, sorry!</span>`;triggerAnim(l('importDesc'),'pucker');}
						});
					});
				}
				else
				{
					var o={};
					try{o=JSON.parse(str);}catch(e){o=0;}
					if (!o || !o.teams || !o.chars) return false;
					//l('creator').innerHTML='';
					var nodes=l('creator').getElementsByClassName('team');
					for (var i=nodes.length-1;i>=0;i--){nodes[i].remove();}
					
					G.teams=[];
					var domN=0;
					var teams={};
					for (var i in o.teams)
					{
						teams[o.teams[i].name]={
							name:STRCLN(o.teams[i].name),
							chars:[],
						};
					}
					for (var i in o.chars)
					{
						teams[o.chars[i].team].chars.push({
							name:STRCLN(o.chars[i].name),
							gender:INTCLN(o.chars[i].g),
							tier:INTCLN(o.chars[i].t||0),
							pic:STRCLN(o.chars[i].pic),
							perks:o.chars[i].perks,
						});
					}
					var hasTeamless=false;
					for (var i in teams){if (teams[i].name=='NOTEAM') hasTeamless=true;}
					if (!hasTeamless) addTeam({name:'NOTEAM',chars:[]});
					for (var i in teams){addTeam(teams[i]);}
					for (var i in G.teams){refreshTeam(G.teams[i]);}
					return true;
				}
			}
			G.exportGame=function()
			{
				var roundData = "";
				for(var i=G.roundLog.length-1;i >= 0; i--)
				{
					roundData += G.roundLog[i] + "\n<nextRound>\n";
				}
				roundData = roundData.substring(0,roundData.length-12);

				var box=`
						<header>Exporting setup</header>
						<div>Copy this text. You can later import your setup by pasting this back in the import menu.</div>
						<textarea id="textareaPrompt" style="width:100%;height:128px;" readonly>${roundData}</textarea>
					`;
				G.popup(box,function(){
						l('textareaPrompt').focus();
						l('textareaPrompt').select();
					});
			}
			G.importGame=function(str)
			{
				if (!str)
				{
					var str=`
						<header>Importing setup</header>
						<div style="overflow:hidden;"><div id="importDesc">Paste in the text you were given on setup export.</div></div>
						<textarea id="textareaPrompt" style="width:100%;height:128px;"></textarea>
					`;
					G.popup(str,function(){
						l('textareaPrompt').focus();
						l('closePopup').innerHTML='Cancel';
						l('closePopup').insertAdjacentHTML('beforebegin','<div id="confirmPopup" class="button bigButton">Load</div>');
						addEvent(l('confirmPopup'),'click',function(){
							var str=l('textareaPrompt').value;
							if(str != "")
							{
								G.importGame(str);
								G.closePopup();
								G.importedGame = true;
								G.start();
								for(var i in G.roundLog)
								{
									G.nextRound();
								}

								// TODO: make this better
								G.roundLog = [];
								var oldRound = str.split("\n<nextRound>\n");
								for(var i = oldRound.length-1; i >= 0; i--)
								{
									console.log("CURRENT ROUND: " + oldRound[i]);
									G.roundLog.push(oldRound[i]);
								}
								G.logBack(true);
								
							}
							else {l('importDesc').innerHTML=`<span style="color:#e2461f;">Looks like that's not a valid game HTML, sorry!</span>`;triggerAnim(l('importDesc'),'pucker');}
						});
					});
				}
				else
				{
					var oldRound = str.split("\n<nextRound>\n");
					for(var i in oldRound)
					{
						//console.log("CURRENT ROUND: " + oldRound[i]);
						G.roundLog.push(oldRound[i]);
					}
				}
			}
			l('main').innerHTML=`
				<div class="box blue">
					<div><cap>Hey there!</cap></div>
					<div>This is a game about pitting you and your friends against each other to see who makes it out alive.</div>
					<div>The game plays itself; you only have to click the "Next round" button to progress.</div>
					<div>Create your teams below then watch the heads roll!</div>
					<div>(Don't forget to export your setups if you want to re-use them later!)</div>
					<div style="opacity:0.5;font-size:10px;float:left;">inspired by <a href="http://brantsteele.net/hungergames/disclaimer.php" target="_blank">Hunger Games Simulator</a></div>
					<div style="opacity:0.5;font-size:10px;float:right;">-Orteil</div>
					<div style="clear:both;"></div>
				</div>
				<!--<div class="box red"><b>Warning :</b> may contain traces of bugs.</div>-->
				<div style="text-align:left;overflow:hidden;"><div class="button" id="importSetup">Import an existing setup...</div> <div class="button" id="exportSetup">Export this setup...</div><div class="button" id="importGame">Import a game...</div><div style="float:right;"><div class="button" id="start2">Start round 1 &gt;</div></div></div>
				<header>Teams</header>
				<div id="creator"></div>
				<div style="text-align:left;"><div class="button" id="addTeam">Add team</div></div>
				<header><div class="button bigButton" id="start">Start round 1</div></header>
			`;
			
			addEvent(l('addTeam'),'click',function(){addTeam();});
			addEvent(l('start'),'click',function(){G.start();});
			addEvent(l('start2'),'click',function(){G.start();});
			addEvent(l('importSetup'),'click',function(){G.importSetup();});
			addEvent(l('exportSetup'),'click',function(){G.exportSetup();});
			addEvent(l('importGame'),'click',function(){G.importGame();});
			G.teams=[];
			var domN=0;
			
			Sortable.create(l('creator'),{group:'teams',ghostClass:'dragGhost',handle:'.handle',onEnd:function(e){
				var el=e.item;
				var me=0;
				for (var i in G.teams)
				{
					var it=G.teams[i];
					if (it.l==el) {me=it;break;}
				}
				G.teams.splice(G.teams.indexOf(me),1);
				G.teams.splice(e.newIndex,0,me);
			}});
			
			var randTeamNames=[`Gazelle`,`Mammoth`,`Phoenix`,`Wolf`,`Tiger`,`Bear`,`Polar bear`,`Viper`,`Cobra`,`Owl`,`Jaguar`,`Lion`,`Spider`,`Scorpion`,`Beetle`,`Wasp`,`Mantis`,`Mongoose`,`T-rex`,`Dragon`,`Gorilla`,`Panda`,`Zebra`,`Unicorn`,`Howler monkey`,`Fox`,`Bunny`,`Falcon`,`Yeti`,`Ox`,`Boar`,`Gryphon`,`Rhino`,`Shark`,`Dolphin`,`Whale`,`Salmon`,`Lobster`,`Hydra`,`Anomalocaris`,`Trilobite`,`Weasel`,`Frog`,`Toad`,`Tortoise`,`Gecko`,`Salamander`,`Lynx`,`Pelican`,`Kitten`,`Puppy`,];
			for (var i in randTeamNames){randTeamNames[i]=`Team `+randTeamNames[i];}
			
			var randNamesM=[`Alastor`,`Bort`,`Champ`,`Dennis`,`Emett`,`Frank`,`Gordon`,`Henry`,`Isaac`,`Jeff`,`Ken`,`Lance`,`Maurice`,`Nathan`,`Oliver`,`Pete`,`Quentin`,`Rafael`,`Sam`,`Todd`,`Umberto`,`Vince`,`Will`,`Xavier`,`Yann`,`Zach`];
			var randNamesF=[`Adeline`,`Bonnie`,`Cecilia`,`Dania`,`Eleanor`,`Fran`,`Gertrude`,`Hazel`,`Ingrid`,`Jen`,`Klara`,`Linda`,`Maud`,`Odile`,`Phyllis`,`Quinn`,`Rose`,`Sophia`,`Tabitha`,`Undine`,`Vanilla`,`Wanda`,`Xia`,`Yasmin`,`Zoe`];
			
			let addTeam=function(o)
			{
				//get random name (prevent duplicates)
				var o=o||{};
				var name='';
				if (o.name) name=o.name;
				else
				{
					var freeNames=randTeamNames.slice(0);
					for (var i in G.teams){if (freeNames.indexOf(G.teams[i].name)!=-1) freeNames.splice(freeNames.indexOf(G.teams[i].name),1);}
					if (freeNames.length==0) freeNames.push('Team Extra');
					//var name='Team #'+(G.teams.length+1);
					name=c(freeNames);
				}
				let team={name:name,members:[],l:0,id:domN};
				if (name=='NOTEAM') team.teamless=true;
				l('creator').insertAdjacentHTML('beforeEnd','<div class="team hasHandle" id="dom'+domN+'"></div>');
				team.l=l('dom'+domN);
				if (!team.teamless)
				{
					team.l.innerHTML=`
						<div class="button" style="float:right;" id="${team.l.id+'-delete'}" title="Delete this team">X</div>
						<div class="handle"></div>
						<div><cap>Team name :</cap> <input type="text" id="${team.l.id+'-name'}" value="${team.name}"/></div>
						<div><cap id="${team.l.id+'-membersN'}"></cap></div>
						<div id="${team.l.id+'-members'}" class="membersList"></div>
						<div><div class="button" id="${team.l.id+'-addChar'}">Add member</div></div>
					`;
					addEvent(l(team.l.id+'-delete'),'click',function(){
						G.teams.splice(G.teams.indexOf(team),1);
						animRemove(team.l);
					});
				}
				else
				{
					team.l.classList.add('teamless');
					team.l.innerHTML=`
						<div class="handle"></div>
						<div><cap>Unaffiliated</cap><span style="font-size:10px;vertical-align:middle;"> - people put in this box do not belong to any team.</span></div>
						<div id="${team.l.id+'-members'}" class="membersList"></div>
						<div><div class="button" id="${team.l.id+'-addChar'}">Add person</div></div>
					`;
				}
				addEvent(l(team.l.id+'-addChar'),'click',function(){addChar(team);});
				
				Sortable.create(l(team.l.id+'-members'),{group:'chars',ghostClass:'dragGhost',handle:'.handle',onEnd:function(e){
					//find the char we just moved and the team we moved it to and update its team
					var el=e.item;
					var toEl=e.to.closest('.team');
					var me=0;
					for (var i in team.members)
					{
						var it=team.members[i];
						if (it.l==el) {me=it;break;}
					}
					var newTeam=0;
					for (var i in G.teams)
					{
						var it=G.teams[i];
						if (it.l==toEl) {newTeam=it;break;}
					}
					if (me && newTeam)
					{
						if (me.team)
						{
							me.team.members.splice(me.team.members.indexOf(me),1);
							refreshTeam(me.team);
						}
						me.team=newTeam;
						me.team.members.splice(e.newIndex,0,me);
						refreshTeam(me.team);
					}
				}});
				
				domN++;
				G.teams.push(team);
				if (!o.chars)
				{
					addChar(team);
					addChar(team);
				}
				else
				{
					for (var i in o.chars)
					{
						addChar(team,o.chars[i]);
					}
				}
				refreshTeam(team);
				animAdd(team.l);
				return team;
			}
			let refreshTeam=function(team)
			{
				if (team.teamless)
				{
				}
				else
				{
					if (team.members.length==0) str='No members';
					else if (team.members.length==1) str='1 member :';
					else str=team.members.length+' members :';
					l(team.l.id+'-membersN').innerHTML=str;
				}
			}
			let addChar=function(team,o)
			{
				var o=o||{};
				var gender=(typeof o.gender !== 'undefined')?o.gender:c([0,0,0,1,1,1,2]);
				var tier=(typeof o.tier !== 'undefined')?o.tier:0;
				var name='';
				if (o.name) name=o.name;
				else
				{
					var freeNames=(gender==0?(randNamesM.slice(0)):gender==1?(randNamesF.slice(0)):(randNamesM.slice(0).concat(randNamesF.slice(0))));
					for (var i in G.teams){for (var ii in G.teams[i].members){if (freeNames.indexOf(G.teams[i].members[ii].name)!=-1) freeNames.splice(freeNames.indexOf(G.teams[i].members[ii].name),1);}}
					if (freeNames.length==0) freeNames.push('Nobody');
					name=c(freeNames);
				}
				
				let char={team:team,name:name,pic:o.pic||'pikasit.png',gender:gender,tier:tier,perks:[],l:0,id:domN};
				l(team.l.id+'-members').insertAdjacentHTML('beforeend','<div class="char hasHandle" id="dom'+domN+'"></div>');
				char.l=l('dom'+domN);
				
				var traitsStr='';
				var itemsStr='';
				
				var traits=[];
				var traitsList=[];
				for (var i in G.perks)
				{
					var me=G.perks[i];
					if (me.def && me.type=='trait') traitsList.push(me);
				}
				var items=[];
				var itemsList=[];
				for (var i in G.perks)
				{
					var me=G.perks[i];
					if (me.def && me.type=='item') itemsList.push(me);
				}
				
				var minTraits=2;
				var minItems=1;
				
				// Disable randomly giving traits and items to new players
				if (!o.perks)
				{
					for (var i=0;i<minTraits;i++)
					{
						//traits.push(c(traitsList));
					}
					for (var i=0;i<minItems;i++)
					{
						//items.push(c(itemsList));
					}
				}
				
				if (o.perks)
				{
					for (var i in o.perks)
					{
						var perk=G.perksBN[o.perks[i]];
						if (perk.def && perk.type=='trait') traits.push(perk);
						else if (perk.def && perk.type=='item') items.push(perk);
					}
				}
				while (traits.length<minTraits)
				{
					traits.push(G.perksBN['no perk']);
				}
				while (items.length<minItems)
				{
					items.push(G.perksBN['no item']);
				}
				
				var n=0;
				for (var i=0;i<traits.length;i++)
				{
					traitsStr+=`${perkSelector('trait',char.l.id+'-perk-'+n,traits[i])} `;
					n++;
				}
				for (var i=0;i<items.length;i++)
				{
					itemsStr+=`${perkSelector('item',char.l.id+'-perk-'+n,items[i])} `;
					n++;
				}
				
				char.l.innerHTML=`
					<div class="button" style="float:right;" id="${char.l.id+'-delete'}" title="Delete this person">X</div>
					<div class="handle"></div>
					<div class="picBox"><img src="${char.pic||'pikasit.png'}" id="${char.l.id+'-pic'}" class="pic"/></div>
					Name : <input type="text" size="14" id="${char.l.id+'-name'}" value="${char.name}"/> 
					<select id="${char.l.id+'-gender'}"><option value="0"${char.gender==0?' selected="selected"':''}>he</option><option value="1"${char.gender==1?' selected="selected"':''}>she</option><option value="2"${char.gender==2?' selected="selected"':''}>they</option></select> 
					<select id="${char.l.id+'-tier'}"><option title="Character acts every round." value="0"${char.tier==0?' selected="selected"':''}>main</option><option title="Character only acts every now and then." value="1"${char.tier==1?' selected="selected"':''}>minor</option></select> 
					Pic URL : <input type="text" size="24" id="${char.l.id+'-picUrl'}" value="${char.pic}"/> 
					<br>
					Perks : ${traitsStr} Item : ${itemsStr} 
				`;
				addEvent(l(char.l.id+'-delete'),'click',function(){
					team.members.splice(team.members.indexOf(char),1);
					animRemove(char.l);
					refreshTeam(team);
				});
				addEvent(l(char.l.id+'-picUrl'),'input',function(){
					var val=l(char.l.id+'-picUrl').value;
					if (val.length<3) val='pikasit.png';
					l(char.l.id+'-pic').src=val;
					char.pic=val;
				});
				//addEvent(l(char.l.id+'-pic'),'dragstart',function(e){e.preventDefault();});
				
				domN++;
				team.members.push(char);
				animAdd(char.l);
				refreshTeam(team);
				return char;
			}
			
			var perkSelector=function(type,id,def)
			{
				var str='';
				var perks=[];
				for (var i in G.perks)
				{
					var me=G.perks[i];
					if (me.def && me.type==type) perks.push(me);
				}
				var selected=def||c(perks);
				for (var i in perks)
				{
					var me=perks[i];
					str+=`<option value="${me.id}" title="${me.desc}"${me==selected?' selected="selected"':''}>${me.name}</option>`;
				}
				return '<select id="'+id+'">'+str+'</select>';
			}
			
			var team=addTeam({name:'NOTEAM',chars:[]});
			var team=addTeam();
			var team=addTeam();
			
			if (G.setupData) G.importSetup(JSON.stringify(G.setupData));
		}
		
		
		G.viewDetails=function()
		{
			var str=`
				<header>Details</header>
				<div>
			`;
			
			var teams=G.teams.slice(0);
			var teamless={chars:[],name:'NOTEAM'};
			for (var i=0;i<G.chars.length;i++){if (!G.chars[i].team){teamless.chars.push(G.chars[i]);}}
			if (teamless.chars.length>0) teams.unshift(teamless);
			
			for (var i=0;i<teams.length;i++)
			{
				var team=teams[i];
				if (team.name=='NOTEAM') str+=`<div class="box team teamless"><cap>Unaffiliated</cap>`;
				else str+=`<div class="box team ${i%2==0?'blue':'red'}"><cap>${team.name}</cap>`;
				for (var ii=0;ii<team.chars.length;ii++)
				{
					var me=team.chars[ii];
					str+=`
					<div class="char" style="font-size:12px;">
						<div class="picBox"><img src="${me.pic}" class="pic" title="${me.name}"/>${me.has('dead')?'<div class="picSkull"></div>':''}</div>
						<div style="text-align:center;">
							<e style="float:left;margin-right:8px;">${me.name}</e>
							<div style="min-width:32%;display:inline-block;"><cap>Perks :</cap> ${me.perks.map(perk=>(perk.type=='trait' && perk.name!='no perk')?('<div class="bit" title="'+perk.desc+'">'+perk.name+'</div>'):'').join(' ')}</div>
							<div style="min-width:32%;display:inline-block;"><cap>Items :</cap> ${me.perks.map(perk=>(perk.type=='item' && perk.name!='no item')?('<div class="bit" title="'+perk.desc+'">'+perk.name+'</div>'):'').join(' ')}</div>
							<div style="min-width:32%;display:inline-block;"><cap>Other :</cap> ${me.perks.map(perk=>(perk.type!='item' && perk.type!='trait')?('<div class="bit" title="'+perk.desc+'">'+perk.name+'</div>'):'').join(' ')}</div>
						</div>
						${me.kills.length>0?('<div style="color:#e2461f;">Killed '+me.kills.length+' (<e>'+me.kills.map(char=>char.name).join(', ')+'</e>)</div>'):''}
						${(me.killer.length>0 && me.has('dead'))?('<div style="color:#e2461f;">Dead, killed by <e>'+me.killer.map(char=>char.name).join(', ')+'</e> ('+me.deathReason+')</div>'):''}
						${(me.killer.length==0 && me.has('dead'))?('<div style="color:#e2461f;">Dead ('+me.deathReason+')</div>'):''}
					</div>`;
				}
				str+=`</div>`;
			}
			str+=`</div>`;
			
			G.popup(str,function(){
			});
		}
		
		G.started=false;
		G.start=function()
		{
			G.started=true;
			G.setupData=G.exportSetup(-1);
			
			G.deaths=0;
			
			var teams=G.teams;
			G.teams=[];
			G.chars=[];
			G.team=function(o)
			{
				this.type='team';
				this.chars=[];
				for (var i in o){this[i]=o[i];}
				for (var i in this.chars){this.chars[i].team=this;}
				G.teams.push(this);
			}
				G.team.prototype.pick=function(n)
				{
					if (this.chars.length<n) return false;
					var members=shuffle(this.chars.slice(0));
					return members.slice(0,n);
				}
				G.team.prototype.dissolve=function()
				{
					//kick all members and delete self
					for (var i in this.chars)
					{
						this.chars[i].team=0;
					}
					G.teams.splice(G.teams.indexOf(this),1);
				}
			G.char=function(o)
			{
				this.type='char';
				this.perks=[];
				this.team=0;
				this.kills=[];
				this.deathReason='';
				this.killer=[];
				this.placement = 1;
				for (var i in o){this[i]=o[i];}
				G.chars.push(this);
			}
				G.char.prototype.has=function(perk)
				{
					if (typeof perk==='string')
					{
						if (!G.perksBN[perk]) {console.log('No perk named','"'+perk+'"');return false;}
						perk=G.perksBN[perk];
					}
					for (var i in this.perks)
					{
						if (this.perks[i].name==perk.name) return true;
					}
					return false;
				}
				G.char.prototype.gain=function(perk)
				{
					if (typeof perk==='string')
					{
						if (!G.perksBN[perk]) {console.log('No perk named','"'+perk+'"');return false;}
						perk=G.perksBN[perk];
					}
					if (perk.type=='item' || !this.has(perk)) this.perks.push(perk);
				}
				G.char.prototype.lose=function(perk)
				{
					if (typeof perk==='string')
					{
						if (!G.perksBN[perk]) {console.log('No perk named','"'+perk+'"');return false;}
						perk=G.perksBN[perk];
					}
					if (this.has(perk)) this.perks.splice(this.perks.indexOf(perk),1);
				}
				G.char.prototype.give=function(other,perk)
				{
					if (typeof perk==='string')
					{
						if (!G.perksBN[perk]) {console.log('No perk named','"'+perk+'"');return false;}
						perk=G.perksBN[perk];
					}
					if (this.has(perk)) {this.lose(perk);other.gain(perk);}
				}
				G.char.prototype.die=function(reason)
				{
					if (!this.has('dead'))
					{
						G.deaths++;
						G.deadThisRound.push(this);
						this.gain('dead');
						if (reason) this.deathReason=reason;
						//if (this.team) {this.team.chars.splice(this.team.chars.indexOf(this),1);this.team=0;}
						
						var alive=1;
						for (var i in G.chars)
						{
							var me=G.chars[i];
							if (!me.has('dead')) alive++;
						}
						this.placement = alive;

						return true;
					}
					return false;
				}
				G.char.prototype.kill=function(other,reason,accomplices)
				{
					if (other.die(reason))
					{
						this.gain('has killed');
						if (other.killer.indexOf(this)==-1) 
						{
							other.killer.push(this);
							var alive=1;
							for (var i in G.chars)
							{
								var me=G.chars[i];
								if (!me.has('dead')) alive++;
							}
							other.placement = alive;
						}
						if (this.kills.indexOf(other)==-1) this.kills.push(other);
						if (accomplices)
						{
							if (!Array.isArray(accomplices)) accomplices=[accomplices];
							for (var i in accomplices)
							{
								accomplices[i].gain('has killed');
								if (other.killer.indexOf(accomplices[i])==-1) other.killer.push(accomplices[i]);
								if (accomplices[i].kills.indexOf(other)==-1) accomplices[i].kills.push(other);
							}
						}
					}
				}
				G.char.prototype.leave=function()
				{
					if (this.team) {this.team.chars.splice(this.team.chars.indexOf(this),1);this.team=0;}
				}
				G.char.prototype.join=function(team)
				{
					if (this.team) this.leave();
					if (team) {this.team=team;team.chars.push(this);}
				}
			
			
			//convert team setup into actual members and teams
			for (var i in teams)
			{
				var base=teams[i];
				if (!base.teamless) base.name=STRCLN(l(base.l.id+'-name').value); else base.name='NOTEAM';
				var members=[];
				for (var i in base.members)
				{
					var member=base.members[i];
					member.name=STRCLN(l(member.l.id+'-name').value);
					member.gender=INTCLN(parseInt(l(member.l.id+'-gender').options[l(member.l.id+'-gender').selectedIndex].value));
					member.tier=INTCLN(parseInt(l(member.l.id+'-tier').options[l(member.l.id+'-tier').selectedIndex].value));
					var val=STRCLN(member.pic);
					if (val.length<3) member.pic='pikasit.png';
					else member.pic=val;
					var perks=[];
					var perkN=0;
					while (l(member.l.id+'-perk-'+perkN))
					{
						var el=l(member.l.id+'-perk-'+perkN);
						var perk=G.perks[el.options[el.selectedIndex].value];
						if (perk.name!='no perk' && perk.name!='no item' && (perk.type!='trait' || perks.indexOf(perk)==-1)) perks.push(perk);
						perkN++;
					}
					var me=new G.char({name:member.name,pic:member.pic,perks:perks,gender:member.gender,tier:member.tier});
					members.push(me);
				}
				if (!base.teamless) new G.team({name:base.name,chars:members});
			}
			
			G.acts=[];
			G.actsForced=[];
			G.actsOther=[];
			let FORCE=-100;
			G.act=function(chance,people,text,func=0,tag='none')
			{
				this.chance=chance;
				this.people=people;
				this.text=text;
				this.func=func||0;
				this.tag = tag;
				this.uses=0;
				G.acts.push(this);
				if (this.chance==FORCE) G.actsForced.push(this);
				else G.actsOther.push(this);
			}
				G.getActUses=function()
				{
					var list=G.acts.slice(0);
					list.sort((a,b)=>a.uses-b.uses);
					console.log(list.map(me=>(me.uses+' : '+me.text)));
				}
				let testCond=function(val,cond)
				{
					//can handle val:1, val:<1, val:>1
					var op=cond.charAt(0);
					if (op=='<' || op=='>'){cond=cond.substr(1);}
					else op=0;
					cond=parseInt(cond);
					if (op=='>' && val>cond) return true;
					else if (op=='<' && val<cond) return true;
					else if (!op && val==cond) return true;
					else return false;
				}
				G.act.prototype.fit=function(me)
				{
					/*
						returns one or more people/team who fit the given conditions
						the "me" parameter specifies which person/team the first condition must match
						ie. ['shotgun lunatic','- meek'] will return a person with the "shotgun" and "lunatic" perks, and a person who is "meek" and on a different team
						syntax :
							'perk_name'
								> must have the perk
							'!perk_name'
								> must not have the perk
							'perk_name|other_perk|third_perk'
								> must have either of those perks
							'!perk_name|other_perk|third_perk'
								> must not have any of those perks
							'team'
								> must be a team (otherwise must be a person)
							'members:3' 'members:<3' 'members:>3'
								> team must have the specified amount of members
							'alive:3' 'alive:<3' 'alive:>3'
								> this many people must be alive
							'dead:3' 'dead:<3' 'dead:>3'
								> this many people must be dead
							'deaths:3' 'deaths:<3' 'deaths:>3'
								> this many deaths must have happened
							'teamalive:3' 'teamalive:<3' 'teamalive:>3'
								> this many in the team must be dead
							'teamdeaths:3' 'teamdeaths:<3' 'teamdeaths:>3'
								> this many in the team must be dead
							'+'
								> must be the same team as the previous team/person selected
							'-'
								> must be a different team
							'inTeam'
								> must be in a team
							'noTeam'
								> must not be in a team
							'!out'
								> must not have a perk marked .out (dead, sheep, comatose etc)
							'!able'
								> must have a perk marked .disable (trapped, shell-shocked etc)
							'any'
								> can be abled or disabled (still doesn't accept out)
					*/
					
					var selected=[];
					
					var prevTeam=0;
					
					for (var i=0;i<this.people.length;i++)
					{
						console.log("thing:" + this.people[i]);
						var req=this.people[i].split(' ');
						//if (req.indexOf('team')==-1 && req.indexOf('dead')==-1) req.unshift('!dead');
						
						var pool=[];
						if (req.indexOf('team')!=-1) pool=G.teams;
						else pool=G.chars;
						pool=shuffle(pool);
						if (i==0 && pool.indexOf(me)==-1) pool=[];
						
						var found=false;
						for (var ii=0;ii<pool.length;ii++)
						{
							var it=pool[ii];
							var fit=true;
							if (selected.indexOf(it)!=-1) {fit=false;continue;}
							if (i==0 && it!=me) {fit=false;continue;}
							if (i==0 && it.acted) {fit=false;continue;}
							
							var team=0;
							if (it.type=='team') team=it; else team=it.team;
							var forceSame=false;
							var forceDif=false;
							
							var able=true;
							var out=false;
							var any=req.indexOf('any')==-1?false:true;
							var every=req.indexOf('every')==-1?false:true;
							
							if (it.type!='team')
							{
								for (var iii in it.perks)
								{
									if (it.perks[iii].disable) able=false;
									if (it.perks[iii].out) out=true;
								}
							}
							
							//goal : [any] should give us both able and disabled, otherwise block disabled unless a perk calls it
							
							//filter for abnormal perks (we don't select people with those perks unless the req specifically calls for it)
							//todo : this doesn't match multiple choices like terrified|shell-shocked|dazed
							if (it.type!='team')
							{
								var tolerateDisabled=false;
								var tolerateOut=false;
								
								if (every) {tolerateDisabled=true;tolerateOut=true;}
								for (var iii in it.perks)
								{
									var perk=it.perks[iii];
									var needed=(req.indexOf(perk.name)!=-1);
									if (perk.disable && needed) {tolerateDisabled=true;}
									if (perk.out && needed) {tolerateOut=true;}
									if (!every && ((perk.disable && !any) || perk.out) && !needed) {fit=false;break;}
									//if (((perk.disable && !any) || perk.out) && req.indexOf(perk.name)==-1) {fit=false;break;}
								}
								if (!tolerateDisabled && !able && !any) fit=false;
								if (!tolerateOut && out) fit=false;
							}
							
							if (fit)
							{
								for (var iii=0;iii<req.length;iii++)
								{
									var bit=req[iii];
									var bitSplit=bit.split(':');
									var prop=bitSplit[0]?bitSplit[0]:0;
									var arg=bitSplit[1]?bitSplit[1]:0;
									if (!arg) prop=0;
									
									if (bit=='') {}
									else if (bit=='team') {}
									else if (bit=='out') {if (!out){fit=false;break;}}
										else if (bit=='!out') {if (out){fit=false;break;}}
									else if (bit=='able') {if (!able){fit=false;break;}}
										else if (bit=='!able') {if (able){fit=false;break;}}
									else if (bit=='any') {}
									else if (bit=='every') {}
									else if (bit=='inTeam') {if (!it.team){fit=false;break;}}
									else if (bit=='noTeam') {if (it.team){fit=false;break;}}
									else if (bit=='+') {forceSame=true;forceDif=false;}
									else if (bit=='-') forceDif=true;
									else if (prop=='members'){if (!it.chars || !testCond(it.chars,arg)){fit=false;break;}}
									else if (prop=='alive')
									{
										var alive=0;
										for (var iiii in G.chars)
										{
											if (!G.chars[iiii].has('dead')) alive++;
										}
										if (!testCond(alive,arg)){fit=false;break;}
									}
									else if (prop=='dead')
									{
										var dead=0;
										for (var iiii in G.chars)
										{
											if (G.chars[iiii].has('dead')) dead++;
										}
										if (!testCond(dead,arg)){fit=false;break;}
									}
									else if (prop=='deaths'){if (!testCond(G.deaths,arg)){fit=false;break;}}
									else if (prop=='teamalive')
									{
										if (!team) {fit=false;break;}
										else
										{
											var alive=0;
											for (var iiii in team.chars)
											{
												if (!team.chars[iiii].has('dead')) alive++;
											}
											if (!testCond(alive,arg)){fit=false;break;}
										}
									}
									else if (prop=='teamdead' || prop=='teamdeaths')
									{
										if (!team) {fit=false;break;}
										else
										{
											var dead=0;
											for (var iiii in team.chars)
											{
												if (team.chars[iiii].has('dead')) dead++;
											}
											if (!testCond(dead,arg)){fit=false;break;}
										}
									}
									else if (it.type=='char')
									{
										//probably perk
										var neg=false;
										bit=bit.replaceAll('_',' ');
										if (bit.charAt(0)=='!')
										{
											bit=bit.substr(1);
											neg=true;
										}
										if (bit.indexOf('|')!=-1)//either
										{
											bit=bit.split('|');
											var hasAnyPerk=false;
											for (var iiii in bit)//this might be the first time i've reached iiii
											{
												if (it.has(bit[iiii])) {hasAnyPerk=true;break;}
											}
											if ((hasAnyPerk && neg) || (!hasAnyPerk && !neg)) {fit=false;break;}
										}
										else
										{
											var hasPerk=it.has(bit);
											if ((hasPerk && neg) || (!hasPerk && !neg)) {fit=false;break;}
										}
									}
								}
								
								if (i>0 && forceSame && (!team || team!=prevTeam)) fit=false;
								if (i>0 && forceDif && team && team==prevTeam) fit=false;
							}
							
							if (fit)
							{
								selected.push(it);
								prevTeam=team;
								found=it;
								break;
							}
						}
						if (!found) return false;
					}
					if (selected.length!=this.people.length) return false;
					return selected;
				}
			
			//NOTE : the first person or team in an act counts as its main actor; they cannot be the main actor of another act in the same round
			
			/*
			new G.act(FORCE,['team members:1','+'],`[2] sees no point in being the only member in [1] and dissolves it.`,p=>{p[1].dissolve();});
			*/
			
			//trait-related idling
			new G.act(1,[''],`[1] [hums a song to [1:themself].
				|twiddles [1:their] thumbs.
				|thinks about what [1:they] did to end up here.
				|wonders about the future.
				|has a horrible feeling in [1:their] [chest|gut].
				|stares into the distance.																
				|constructs a shack.												
				|travels to higher ground.
				|thinks about [home|winning].
				|climbs a tree to rest.
				|sets up camp.
			]`);			
			// Day acts
			new G.act(1,[''], `
				[1] [tries to sleep through the entire day.
				|picks flowers.
				|goes [hunting|fishing].
				|explores the arena.
				|searches for [firewood|a water source|food].
				|sees smoke rising in the distance, but decides not to investigate.
				|collects fruit from a tree.
				|discovers a [cave|river|lake|hole].
			]`,p=>{},tag='day');
			// Night acts
			new G.act(1,[''], `
				[1] [goes to sleep.
				|starts a fire.
				|loses sight of where [1:g|he is|she is|they are].
				|attempts to start a fire, but is unsuccessful.
				|looks at the night sky.
				|is unable to start a fire and sleep without warmth.
				|is awoken by nightmares.
				|cries [1:g|himself|herself|themself] to sleep.
				|stays awake all night.
				|screams for help.
				|sees a fire, but stays hidden.
				|cooks [1:their] food before putting [1:their] fire out.
			]`,p=>{},tag='night');
			new G.act(0.5,['scratched'],`[1] fails to treat [1:their] scratches.`);
			new G.act(0.5,['bruised'],`[1] fails to treat [1:their] bruises.`);
			new G.act(0.5,['cut_up'],`[1] fails to treat [1:their] cuts.`);
			new G.act(0.5,['burnt'],`[1] fails to treat [1:their] burns.`);

			// Idle with 2
			new G.act(0.2,['',''],`[1] [scares [2] off.
				|and [2] hunt for other tributes.
				|and [2] tell stories about each other.
				|and [2] talk about the tributes still alive.
				|begs for [2] to kill [1:them]. [2:g|He refuses|She refuses|They refuse], keeping [1] alive.
				|lets [2] into [1:their] shelter.
				|and [2] hold hands.
			]`)
			// Day acts
			new G.act(0.2,['',''],`[1] [works with [2] for the day.
				|chases [2].
				|runs away from [2].
			]`,p=>{},tag='day')
			// Night acts
			new G.act(0.2,['',''],`[1] and [2] run into each other and decide to truce for the night.`,p=>{},tag='night')							

			// Idle with 3
			new G.act(0.1,['','',''],`[ [1] overhears [2] and [3] talking in the distance.
				|[1], [2], and [3] go hunting for other tributes.
				|[1], [2], and [3] discuss the games and what might happen next.
			]`);
			new G.act(0.1,['','',''],`[ [1], [2], and [3] sleep in shifts.
				|[1], [2], and [3] tell ghost stories to lighten the mood.
				|[1], [2], and [3] cheerfully sing songs together.
			]`,p=>{},tag='night');
			// Team ver
			new G.act(0.2,['','+','+'],`[ [1], [2], and [3] go hunting for other tributes.
				|[1], [2], and [3] discuss the games and what might happen next.
			]`);
			new G.act(0.2,['','-','-'],`[1] overhears [2] and [3] talking in the distance.`)
			new G.act(0.2,['','+','+'],`[ [1], [2], and [3] sleep in shifts.
				|[1], [2], and [3] tell ghost stories to lighten the mood.
				|[1], [2], and [3] cheerfully sing songs together.
			]`,p=>{},tag='night');

			// Idle with 4
			new G.act(0.05,['','','',''],`[1], [2], [3], and [4] go hunting for other tributes`);
			// Night acts
			new G.act(0.05,['','','',''],`[
				[1], [2], [3], and [4] sleep in shifts.
				|[1], [2], [3], and [4] tell ghost stories to lighten the mood.
				|[1] fends [2], [3], and [4] away from [1:their] fire.
			]`,p=>{},tag='night');
			// Team ver
			new G.act(0.1,['','+','+','+'],`[1], [2], [3], and [4] go hunting for other tributes`);
			// Night acts
			new G.act(0.1,['','+','+','+'],`[
				[1], [2], [3], and [4] sleep in shifts.
				|[1], [2], [3], and [4] tell ghost stories to lighten the mood.
			]`,p=>{},tag='night');
			new G.act(0.1,['','-','-','-'],`[1] fends [2], [3], and [4] away from [1:their] fire.`,p=>{},tag='night')

			// Idle with 5
			new G.act(0.025,['','','','',''],`[RED][1], [2], [3], and [4] destroy [5]'s supplies while [5:g|he is|she is|they are] away.`
			,p=>
			{
				var itemsToLose = [];
				for(var i in p[5].perks)
				{
					if(p[5].perks[i].type == 'item')
					{
						itemsToLose.push(p[5].perks[i].name);
					}
				}

				for(var j in itemsToLose)
				{
					p[5].lose(itemsToLose[j]);
				}
			});
			// Team ver
			new G.act(0.05,['','+','+','+',''],`[RED][1], [2], [3], and [4] destroy [5]'s supplies while [5:g|he is|she is|they are] away.`
			,p=>
			{
				var itemsToLose = [];
				for(var i in p[5].perks)
				{
					if(p[5].perks[i].type == 'item')
					{
						itemsToLose.push(p[5].perks[i].name);
					}
				}

				for(var j in itemsToLose)
				{
					p[5].lose(itemsToLose[j]);
				}
			});

			// Team Idles?
			
			// Acts related to injuries
			new G.act(0.1,[''],`[YELLOW][1] is pricked by thorns while trying to gather berries.`,p=>{p[1].gain('scratched');});
			new G.act(0.1,['','- any'],`[YELLOW][1] defeats [2] in a fight, but spares [2:them], leaving [2:them] bruised.`,p=>{p[2].gain('bruised');});
				new G.act(0.1,['','- any'],`[YELLOW][1] attacks [2], but [2:g|he manages|she manages|they manage] to escape, bruised.`,p=>{p[2].gain('bruised');});
			new G.act(0.1,['','- any'],`[YELLOW][1] injures [1:g|himself|herself|themself] while running away from [2].`,p=>{p[1].gain('bruised');});
			
			new G.act(0.1,['scratched|bruised|cut_up'],`[GREEN][1] tends to [1:their] wounds.`,p=>
			{
				p[1].lose('scratched');
				p[1].lose('bruised');
				p[1].lose('cut up');
			});	
			new G.act(0.2,['','+ scratched|bruised|cut_up|burnt|bleeding_out'],`[GREEN][1] treats [2]'s injuries.`,p=>
			{
				p[2].lose('scratched');
				p[2].lose('bruised');
				p[2].lose('cut up');
				p[2].lose('burnt');
				p[2].lose('bleeding out');
			});	

			new G.act(1,['volleyball'],`[1] practices [1:their] [set|jump serve|float serve|overhand serve|underhand serve|spikes|line shot|cut shot|setter dump].`);
			new G.act(1,['volleyball_freak'],`[1] thinks about [volleyball|going to Nationals|playing volleyball with someone].`);
				new G.act(0.1,['volleyball_freak', '+ !volleyball_freak'],`[1] teaches [2] how to play volleyball.`,p=>{p[2].gain('volleyball freak')});
			
			new G.act(1,['fighter'],`[1] [wants to fight someone|starts to train|wants a good match|is thinking about fighting someone strong].`);
				new G.act(0.5,['fighter','fighter'],`[1] and [2] [train together.|fight against each other as training.]`);
			new G.act(0.4,['fighter','- any'],`[YELLOW][
				[1] defeats [2] in a fight, but lets [2:them] go so [2:they] can get stronger.
				|To prove [1:their] strength, [1] defeats [2] in a fight.
				|[1] challenges [2] to a fight, beating [2:them].
			]`,p=>{p[2].gain('bruised');});
			new G.act(0.4,['fighter','- any'],`[1] challenges [2] to a fight, but [2] was too strong, defeating [1].`,p=>{p[1].gain('bruised');});
			// Bringing back unknown sponsors
			new G.act(0.3*0.05,['!volleyball'],`[BLUE][1] receives a volleyball from an unknown sponsor.`,p=>{p[1].gain('volleyball');});
			new G.act(0.3*0.05,['scratched|bruised|cut_up|burnt|bleeding_out'],`[GREEN][1] receives a first-aid kit from an unknown sponsor.`,p=>
			{
				p[2].lose('scratched');
				p[2].lose('bruised');
				p[2].lose('cut up');
				p[2].lose('burnt');
				p[2].lose('bleeding out');
			});
			new G.act(0.3*0.05,['!grenade'],`[BLUE][1] receives a grenade from an unknown sponsor.`,p=>{p[1].gain('grenade');});
			new G.act(0.3*0.05,['!landmine'],`[BLUE][1] receives a landmine from an unknown sponsor.`,p=>{p[1].gain('landmine');});

			new G.act(0.5,['landmine'],`[1] arms [1:their] landmine and hides it somewhere.`,p=>{p[1].gain('set landmine'); p[1].lose('landmine');});
				new G.act(0.2,['!survivalist landmine'],`[RED][1] accidentally detonates [1:their] landmine while trying to arm it.`,p=>{p[1].die('self landmine');});
				new G.act(0.5,['any','set_landmine'],`[RED][1] steps on [2]'s landmine.`,p=>{p[2].kill(p[1],'landmine');});



			new G.act(1,['leader','+ team teamalive:>2'],`[1] [hopes to get everyone out of here|tries to keep a brave face on for everyone's sake].`);
				new G.act(0.5,['leader','+ leader|devious'],`[1] and [2] get into an argument over who should be in charge.`);
				new G.act(0.5,['leader !sociopath','+ team teamalive:>2 teamdeaths:0'],`[1] is proud to lead [2].`);
				new G.act(0.5,['leader !sociopath','+ team teamalive:>2 teamdeaths:>0'],`[1] made some mistakes as a leader, but wants to do right by [2].`);
				new G.act(0.5,['leader !sociopath','+ team teamdeaths:>1'],`[1] feels horrible for failing [2]...`);
				new G.act(0.5,['naive leader','+ team teamdeaths:0'],`[1] wants to lead [2] to victory, but isn't sure how to proceed...`);
				new G.act(0.5,['devious|sociopath leader','+ team teamalive:>1'],`[1] sees [2] as a bunch of chumps to be milked.`);
			new G.act(1,['peaceful'],`[1] [doesn't feel prepared for any of this|hopes [1:g|he doesn't|she doesn't|they don't] have to harm anyone].`);
				new G.act(0.5,['kind|naive|peaceful','+ peaceful'],`[1] seems to find [2]'s presence soothing.`);
			new G.act(1,['sociopath deaths:>0'],`[1] [seems unshaken by any of this|is only looking out for [1:themself]].`);
			new G.act(1,['kind teamalive:>1'],`[1] [just wants to be helpful|is ready to defend [1:their] friends].`);
				new G.act(0.5,['kind|naive|peaceful','+ kind'],`[1] thanks [2] for being there for [1:them].`);
				new G.act(0.5,['kind','+ cute'],`[1] [can't stop fawning over [2]...|wants to protect [2]!]`);
				new G.act(0.5,['kind','+ shell-shocked'],`[[1] tries to cheer [2] up, but it's not really working...|[1] is really worried about [2]...|[1] doesn't know how to cheer [2] up...]`);
			new G.act(1,['unstable'],`[1] [looks on the verge of snapping|twitches uncontrollably].`);
			new G.act(1,['bulky'],`[1] [sizes [1:their] muscles|feels strong enough to handle anything].`);
			new G.act(1,['meek'],`[1] [wants this to be over already|wishes [1:they] could go home].`);
				new G.act(0.5,['meek','+ bulky|leader'],`[1] is glad [1:they] can rely on [2].`);
			new G.act(1,['naive'],`[1] [doesn't really understand what's happening|fails to grasp the gravity of the situation].`);
				new G.act(0.5,['kind|naive','+ kind|naive|cute'],`[1] and [2]'s fingers touch by accident.<br>They both blush a little bit...`);
				new G.act(0.5,['naive !leader','+ leader'],`[1] admires [2]'s [leadership|confidence|decisiveness].`);
				new G.act(0.5,['naive !bulky','+ bulky'],`[1] admires [2]'s [muscles|strength].`);
				new G.act(0.5,['naive alive:1'],`[1] looks around. Where did everybody go?`);
			new G.act(1,['devious alive:>1'],`[1] [is looking for an easy out|looks for someone dumb enough to believe [1:them]].`);
				new G.act(0.5,['!devious|sociopath','+ devious'],`[1] does [1:their] best to avoid [2].`);
			// new G.act(1,['seductive alive:>1'],`[1] [doesn't care much for this place|tries to get others to notice [1:them]].`);
			// 	new G.act(0.5,['seductive alive:1'],`There's nobody left to notice [1]...`);
			// 	new G.act(0.5,['','+ seductive'],`[1] can't take [1:their] eyes off [2]...`);
			// 	new G.act(0.5,['seductive','+ naive'],`[1] whispers some things in [2]'s ear, but [2] is a bit too innocent to understand.`);
			// 	new G.act(0.5,['seductive','+ rich'],`[1] hits on [2], but [2] finds it suspicious...`);
			// new G.act(1,['suicidal'],`[1] [wishes [1:g|he was|she was|they were] dead|longs for death].`);
			new G.act(1,['cute'],`[1] [is being adorable as always|does something really cute].`);
			new G.act(1,['annoying teamalive:>1'],`[1] [rambles on about something nobody cares about|keeps trying to tell a joke, but it always falls flat].`);
				new G.act(0.5,['annoying','+ annoying'],`[[1] is glad to have someone like [2] [to tell really bad puns to|to have boring conversations with].|[1] and [2] giggle like idiots. Better not ask.]`);
			new G.act(1,['scrappy'],`[1] [looks around for stuff to scrounge|spots something shiny in the distance].`);
			new G.act(1,['survivalist deaths:0'],`[1] [came prepared|could get used to this place].`);
				new G.act(1,['survivalist deaths:>0'],`[1] [is determined to survive this|won't die like the others|won't give up so easily].`);
			new G.act(1,['rich'],`[1] [feels protected by [1:their] wealth|finds all this below his concern].`);
			new G.act(1,['inventor'],`[1] [is thinking of plans to get out of here|is cooking up a genius idea].`);
				new G.act(0.5,['inventor','+ scrappy'],`[1] asks [2] if [2:g|he's|she's|they've] found anything useful.`);
			// new G.act(1,['goth'],`[1] [mopes around uselessly|thinks of a dark, dark poem].`);
			new G.act(1,['lunatic'],`[1] [isn't sure whether to cry, laugh, or tear [1:their] hair out|is looking particularly erratic today].`);
			
			new G.act(1,['survivalist|sociopath alive:1 dead:>0'],`[1] [always knew [1:they]'d be the last to survive|made it out alive, it seems].`);
			new G.act(1,['devious alive:1 dead:>0'],`[1] is glad [1:they] made it out alive.`);
			new G.act(1,['!survivalist|sociopath|devious alive:1 dead:>0'],`[Dead... they're all dead...|[1] stares into the distance... Was it really worth it?|[1] survived... but at what price?]`);
			new G.act(1,['alive:1 dead:0'],`[1] is all by [1:themself].`);
			new G.act(1,['alive:1'],`[1] [screams at nobody in particular|hums to [1:themself]|wishes [1:they] had someone to talk to|].`);
			
			//item-related idling
			new G.act(1,['big_stick !naive|peaceful alive:>1'],`[1] waves [1:their] big stick around menacingly.`);
			new G.act(1,['pitchfork !peaceful'],`[1] wonders how far [1:they] could throw [1:their] pitchfork.`);
			new G.act(1,['sword !peaceful'],`[1] swooshes the air with [1:their] sword.`);
			new G.act(1,['axe !naive|peaceful'],`[1] is ready to use [1:their] axe if [1:g|he has|she has|they have] to.`);
			new G.act(1,['handgun !peaceful'],`[1] aims [1:their] handgun in the distance.`);
				// new G.act(0.3,['handgun suicidal'],`[1] looks at the end of [1:their] handgun, then puts it to [1:their] head. Yeah... that oughta do it.`);
			new G.act(1,['shotgun !naive|peaceful'],`[1] reloads [1:their] shotgun, just in case.`);
				// new G.act(0.3,['shotgun suicidal'],`[1] looks at the end of [1:their] shotgun, then puts it to [1:their] head. Yeah... that oughta do it.`);
			new G.act(1,['grenade !peaceful'],`[1] juggles a bit with [1:their] grenade, kind of wanting to use it...`);
			new G.act(1,['rocket_launcher !peaceful'],`[1] loves the way [1:their] rocket launcher feels on [1:their] shoulder.`);
			new G.act(1,['slingshot !naive|peaceful'],`[1] gathers ammo for [1:their] slingshot.`);
			new G.act(1,['bow !naive|peaceful'],`[1] practices pulling [1:their] bow's string back.`);
			new G.act(1,['flamethrower !peaceful'],`[1] really wants to use [1:their] flamethrower...`);
			new G.act(1,['lasergun !peaceful'],`[1] feels unstoppable with [1:their] lasergun.`);
			new G.act(1,['magic_wand'],`[1] waves [1:their] magic wand around, sending sparkles everywhere.`);
			new G.act(1,['ancient_scepter'],`[1] polishes [1:their] ancient scepter, making the magic orb shine.`);
			

			new G.act(1,['pet_wolf'],`[[1] pets [1:their] pet wolf to soothe him.|[1]'s pet wolf licks [1:their] [ear|cheek|face]!|[1] teaches [1:their] pet wolf a trick.|[1]'s pet wolf growls contentedly.]`);
				new G.act(0.05,['dead pet_wolf'],`[1]'s pet wolf lets out a sad howl...`);
				new G.act(0.2,['pet_wolf alive:1'],`[1]'s pet wolf is all [1:g|he has|she has|they have] left in the world.`);
			new G.act(1,['pet_tiger'],`[[1] scratches [1:their] pet tiger's neck. That's a good tiger.|[1]'s pet tiger pounces on [1:them] playfully.|[1] plays fetch with [1:their] pet tiger.|[1]'s pet tiger purrs softly.]`);
				new G.act(0.05,['dead pet_tiger'],`[1]'s pet tiger rests by her owner's remains.`);
				new G.act(0.2,['pet_tiger alive:1'],`[1]'s pet tiger is all [1:g|he has|she has|they have] left in the world.`);
			new G.act(1,['pet_turtle'],`[[1] rests again [1:their] pet turtle's flank.|[1] feeds [1:their] pet turtle some lettuce.|[1] watches [1:their] pet turtle ambling around.|[1]'s pet turtle does a really impressive trick.]`);
				new G.act(0.05,['dead pet_turtle'],`[1]'s pet turtle is looking for her owner, but can't find [1:them]...`);
				new G.act(0.2,['pet_turtle alive:1'],`[1]'s pet turtle is all [1:g|he has|she has|they have] left in the world.`);
			
			new G.act(1,['wish_ring'],`[1] ponders about how best to use [1:their] wish ring.`);
			
			//new G.act(0.5,['leather_scraps'],`[1] wearing leather scraps is a sight to behold.`);
			//new G.act(0.5,['bikini'],`[1] [is very proud of|flaunts|looks really good in] [1:their] bikini.`);
			//	new G.act(0.5,['bikini seductive','+'],`Everybody is staring at [1] in [1:their] bikini...`);
			//	new G.act(0.5,['','+ bikini seductive',''],`[1] gets distracted staring at [2]'s bikini.`);
			new G.act(0.25,['dapper_suit'],`[1] [is very proud of|acts cool in|looks amazing in] [1:their] dapper suit.`);
			new G.act(0.25,['knight_armor'],`[1] [looks glorious in|stands proudly in|is ready to cleave some invaders in] [1:their] knight armor.`);
			new G.act(0.5,['combat_gear'],`[1] [looks menacing in|is looking downright tactical in|practices some strategic moves in] [1:their] combat gear.`);
			new G.act(0.5,['wizard_robe'],`[1] [shakes [1:their] wizard sleeves, and a thousand tiny animals fall out|sneezes from all the sparkles coming out of [1:their] wizard robe, making [1:them] levitate for a few seconds|is looking magical today].`);
			
			//finding items
			var itemFindMult=0.3;
			//new G.act(itemFindMult*0.3,['!leather_scraps'],`[BLUE][1] finds some leather scraps, just enough to patch together some rudimentary clothing.<br>It looks rather caveman-like.`,p=>{p[1].gain('leather scraps');});
			//new G.act(itemFindMult*0.05,['!bikini !survivalist'],`[BLUE][1] finds a lovely bikini and puts it on!<br>It's quite revealing.`,p=>{p[1].gain('bikini');});
			new G.act(itemFindMult*0.03,['!dapper_suit !survivalist'],`[BLUE][1] finds a dapper suit and puts it on!<br>It's rather fetching.`,p=>{p[1].gain('dapper suit');});
			new G.act(itemFindMult*0.03,['!knight_armor'],`[BLUE][1] somehow finds a full suit of medieval armor and puts it on!<br>It gleams with a dazzling shine.`,p=>{p[1].gain('knight armor');});
			new G.act(itemFindMult*0.03,['!combat_gear'],`[BLUE][1] somehow finds a bunch of tactical combat gear and equips it!<br>It provides optimal protection for the whole body, without sacrificing flexibility.`,p=>{p[1].gain('combat gear');});
			new G.act(itemFindMult*0.03,['!wizard_robe'],`[BLUE][1] disappears for a while and comes back with a wizard robe [1:they] just found...<br>[1:g|He slips|She slips|They slip] it on, scattering sparkles everywhere.`,p=>{p[1].gain('wizard robe');});
		
			new G.act(itemFindMult*0.04,['!big_stick !peaceful'],`[BLUE][1] finds a big stick...<br>Probably comes in handy to bash some skulls.`,p=>{p[1].gain('big stick');});
			new G.act(itemFindMult*0.04,['!pitchfork !peaceful'],`[BLUE][1] finds a pitchfork, which [1:g|he figures|she figures|they figure] is great for lobbing at enemies.`,p=>{p[1].gain('pitchfork');});
			new G.act(itemFindMult*0.04,['!sword !peaceful'],`[BLUE][1] finds a sword, shiny and sharp.<br>A rather nice find!`,p=>{p[1].gain('sword');});
			new G.act(itemFindMult*0.04,['!axe !peaceful'],`[BLUE][1] finds an axe, upping [1:their] chances of survival somewhat.`,p=>{p[1].gain('axe');});
			new G.act(itemFindMult*0.04,['!handgun !peaceful'],`[BLUE][1] finds a handgun, with just enough bullets to be useful.`,p=>{p[1].gain('handgun');});
			new G.act(itemFindMult*0.04,['!shotgun !peaceful'],`[BLUE][1] finds a shotgun!<br>[1:g|He starts|She starts|They start] thinking about the damage [1:they] can do.`,p=>{p[1].gain('shotgun');});
			new G.act(itemFindMult*0.04,['!grenade !peaceful'],`[BLUE][1] finds a grenade...<br>Better be careful with that.`,p=>{p[1].gain('grenade');});
			new G.act(itemFindMult*0.04,['!rocket_launcher !peaceful'],`[BLUE][1] finds a rocket launcher!<br>That's gonna end well.`,p=>{p[1].gain('rocket launcher');});
			new G.act(itemFindMult*0.04,['!slingshot !peaceful'],`[BLUE][1] finds a slingshot! How quaint...<br>Might be useful in a pinch.`,p=>{p[1].gain('slingshot');});
			new G.act(itemFindMult*0.04,['!bow !peaceful'],`[BLUE][1] finds a bow and some arrows.<br>It'll take some practice but this can surely come in handy.`,p=>{p[1].gain('bow');});
			new G.act(itemFindMult*0.04,['!flamethrower !peaceful'],`[BLUE]Are you kidding? [1] just found a flamethrower!<br>See if anyone gets in [1:their] way now!`,p=>{p[1].gain('flamethrower');});
			new G.act(itemFindMult*0.04,['!lasergun !peaceful'],`[BLUE]Whoah! [1] just found a lasergun!<br>[1:g|He starts|She starts|They start] swinging it around making "pew pew" sounds, before [1:they] realize [1:they] can just pull the trigger and make those sounds for real.`,p=>{p[1].gain('lasergun');});
			new G.act(itemFindMult*0.01,['!magic_wand'],`[BLUE][1] follows some sparkles and discovers a magic wand!<br>Hopefully it still has some spells left in it...`,p=>{p[1].gain('magic wand');});
			new G.act(itemFindMult*0.01,['!ancient_scepter'],`[BLUE][1] catches a strange glow in the corner of [1:their] eye and discovers an ancient scepter!<br>Arcane magic courses through [1:their] body as [1:their] fingers touch the carved wood.`,p=>{p[1].gain('ancient scepter');});
			new G.act(itemFindMult*0.04,['!wish_ring'],`[BLUE][1] was lost in [1:their] thoughts... The next thing [1:g|he knows|she knows|they know], [1:g|he's|she's|they've] found a wish ring.<br>Hopefully [1:they]'ll be responsible with it.`,p=>{p[1].gain('wish ring');});
			
			// Custom Item Find
			new G.act(itemFindMult*0.04,['!volleyball'],`[BLUE][1] finds a volleyball on the ground!`,p=>{p[1].gain('volleyball');});
			new G.act(itemFindMult*0.1,['volleyball_freak !volleyball'],`[BLUE][1] finds a volleyball on the ground!`,p=>{p[1].gain('volleyball');});

			new G.act(itemFindMult*0.04,['!volleyball'],`[BLUE][1] finds some knives!`,p=>{p[1].gain('knives');});

			//todo : scrappy, rich, inventor
			
			//misc
			new G.act(0.1,['lunatic !unstable'],`[RED][1]'s bad brain takes [1:them] to an even stranger place, turning [1:them] even more unstable than before.`,p=>{p[1].gain('unstable');});
			new G.act(0.1,['lunatic !kind'],`[BLUE][1]'s bad brain somehow turns [1:them] a little kinder...`,p=>{p[1].gain('kind');});
				new G.act(0.1,['lunatic kind'],`[RED]Kindness seems to leave [1]'s shifting personality.`,p=>{p[1].lose('kind');});
			new G.act(0.1,['lunatic !devious'],`[RED][1]'s bad brain turns [1:them] into a horrible person...`,p=>{p[1].gain('devious');});
				new G.act(0.1,['lunatic devious'],`[BLUE][1] seems to assume a slightly less cynical worldview.`,p=>{p[1].lose('devious');});
			// new G.act(0.1,['lunatic !suicidal'],`[RED][1]'s bad brain saps [1:their] will to live...`,p=>{p[1].gain('suicidal');});
				// new G.act(0.1,['lunatic suicidal'],`[BLUE][1] seems to find a new will to live.`,p=>{p[1].lose('suicidal');});
			new G.act(0.1,['lunatic !annoying'],`[RED][1]'s bad brain turns [1:them] into an absolute pain to deal with.`,p=>{p[1].gain('annoying');});
				new G.act(0.1,['lunatic annoying'],`[BLUE][1] seems to calm down, understanding that they're not that interesting.`,p=>{p[1].lose('annoying');});
			new G.act(0.05,['lunatic'],`[BLUE][1] calms down for good, no longer subject to the whims of a changing brain.`,p=>{p[1].lose('lunatic');});
			
			new G.act(0.5,['unstable !frenzied'],`[RED][[1] finally snaps!|Something inside [1] snaps!]<br>[1] is now frenzied!`,p=>{p[1].gain('frenzied');});
				new G.act(0.8,['frenzied',''],`[RED]In a fit of frenzy, [1] creeps up on [2] and [snaps [2:their] neck|kills [2:them] dead|slaughters [2:them]|turns [2:them] inside out]!`,p=>{p[1].kill(p[2],`frenzy kill`);});
				new G.act(1,['frenzied'],`[[1] looks around maniacally, seething.|[1] looks for [1:their] next victim...]`);
				new G.act(0.1,['frenzied'],`[RED][Panting like a wild beast, [1:their] eyes bulging out|After rampaging for a while|Raging fury grasping [1:their] chest], [1]'s frenzy grows so overpowering that [1:their] heart gives out...`,p=>{p[1].die(`frenzy heart attack`);});
				new G.act(0.1,['frenzied'],`[1]'s frenzy finally dies down.`,p=>{p[1].lose('frenzied');});
			
			new G.act(0.1,['!sociopath|devious|leader deaths:0'],`[1] [doesn't know yet how bad things are gonna get.|knows not of the horrors yet to come.|is pretty optimistic about all of this.]`);
			new G.act(0.1,['!sociopath|devious|leader deaths:>0'],`[1] [sobs quietly...|starts sobbing uncontrollably.|just wants it to end already...]`);
			
			new G.act(1,['shell-shocked'],`[1] [sits there with a blank stare.|has a blank expression and seems unresponsive to what's going on...|sobs quietly...|starts sobbing uncontrollably.|just wants it to end already...|is on the verge of a nervous breakdown...]`);
			new G.act(0.2,['shell-shocked|terrified|dazed any'],`[1] snaps out of it!`,p=>{p[1].lose('shell-shocked');p[1].lose('terrified');p[1].lose('dazed');});
			// new G.act(0.1,['shell-shocked !suicidal'],`[RED][1] doesn't want to carry on...<br>[1] is now suicidal.`,p=>{p[1].gain('suicidal');});
			
			var coldBloodKiller='!peaceful|kind|naive';
			
			new G.act(0.15,[coldBloodKiller,'- any'],`[RED][1] [ambushes [2]|attacks [2] from behind] and [murders|kills|slaughters|strangles|eviscerates|gets rid of] [2:them]!`,p=>{p[1].kill(p[2],`ambush`);});
			new G.act(0.15,[coldBloodKiller,'-'],`[RED][[1] duels it out with [2]|[1] challenges [2] to a duel|[2] challenges [1] to a duel|[1] wants to end things once and for all with [2]|[2] wants to end things once and for all with [1]].<br>[2] bites the dust!`,p=>{p[1].kill(p[2],`duel`);});
			new G.act(0.05,[coldBloodKiller,'- any','+ any'],`[RED][1] [ambushes [2] and [3]|attacks [2] and [3] from behind|manages to sneak-attack [2] and [3]], [murdering|killing|slaughtering] them both!`,p=>{p[1].kill(p[2],`ambush`);p[1].kill(p[3],`ambush`);});
			new G.act(0.05,[coldBloodKiller,'+ '+coldBloodKiller,'- any'],`[RED][1] and [2] [team up and ambush [3]|come at [3] from both sides|ambush [3]|attack [3] from behind|manage to sneak-attack [3]], [murdering|killing|slaughtering] [3:them]!`,p=>{p[1].kill(p[3],`ambush`,p[2]);});
			new G.act(0.15,[coldBloodKiller,'-'],`[RED][1] tries to kill [2], but [2] retaliates and kills [1:them] instead.`,p=>{p[2].kill(p[1],`retaliation`);});
			new G.act(0.15,[coldBloodKiller,'- any','+ !sociopath any'],`[RED][1] [kills|murders|attacks and kills] [2] [in front of [3]|before [3] can react]!<br>[There is nothing [3] can do...|[3] rushes to help, but [[2] dies in [3:their] arms|it's already too late]...]`,p=>{p[1].kill(p[2],`ambush`);p[3].gain('shell-shocked');});
			new G.act(0.15,[coldBloodKiller,'- any','+ leader|kind|bulky|fighter !survivalist|devious|sociopath'],`[RED][1] attempts to kill [2], but [3] intervenes just in time!<br>[3] had to kill [1] to protect [2]'s life...`,p=>{p[3].kill(p[1],`retaliation`);});
			new G.act(0.15,[coldBloodKiller,'- any','+ leader|kind !survivalist|devious|sociopath'],`[RED][1] attempts to kill [2], but [3] intervenes to protect [2:them]!<br>Unfortunately, [3] dies in the attempt...`,p=>{p[1].kill(p[3],`failed retaliation`);});
			new G.act(0.05,['!survivalist|devious|sociopath|unstable|lunatic !peaceful|kind deaths:>0','- any'],`[RED][1] really doesn't want to, but [1:g|he finds himself|she finds herself|they find themself] having to get rid of [2].`,p=>{p[1].kill(p[2],`murder`);});
			
			new G.act(0.4,[coldBloodKiller+' big_stick','- any'],`[RED][1] bludgeons [2] to death with [1:their] big stick!`,p=>{p[1].kill(p[2],`big stick`);});
			new G.act(0.4,[coldBloodKiller+' pitchfork','- any'],`[RED][1] lobs [1:their] pitchfork at [2], killing [2:them] instantly!`,p=>{p[1].kill(p[2],`pitchfork`);});
				new G.act(0.05,[coldBloodKiller+' pitchfork','- any','+ any'],`[RED][1] skewers [2] and [3] with [1:their] pitchfork!`,p=>{p[1].kill(p[2],`pitchfork`);p[1].kill(p[3],`pitchfork`);});
			new G.act(0.4,[coldBloodKiller+' sword','- any'],`[RED][1] artfully [slices|cleaves] [2] in two with [1:their] sword!`,p=>{p[1].kill(p[2],`sword`);});
				new G.act(0.1,[coldBloodKiller+' sword','- any','+ any'],`[RED][1] artfully [slices|cleaves] through [2] and [3] in one fell swoop.`,p=>{p[1].kill(p[2],`sword`);p[1].kill(p[3],`sword`);});
			new G.act(0.4,[coldBloodKiller+' axe','- any'],`[RED][1] chops [2] to bits with [1:their] axe!`,p=>{p[1].kill(p[2],`axe`);});
				new G.act(0.1,[coldBloodKiller+' axe','- any','+ any'],`[RED][1] goes axe-crazy, chopping [2] and [3] to bits.`,p=>{p[1].kill(p[2],`axe`);p[1].kill(p[3],`axe`);});
			new G.act(0.4,[coldBloodKiller+' handgun','- any'],`[RED][1] finds [1:themself] face-to-face with [2] and shoots [2:them] dead with [1:their] gun!`,p=>{p[1].kill(p[2],`handgun`);});
				new G.act(0.2,[coldBloodKiller+' handgun','- handgun !peaceful'],`[RED][1] and [2] duel it out, guns drawn.<br>[Two shots are fired.|One shot is fired.] [2] falls over, dead.`,p=>{p[1].kill(p[2],`gun duel`);});
				new G.act(0.2,[coldBloodKiller+' handgun','- handgun !peaceful'],`[RED][1] and [2] duel it out, guns drawn.<br>[Two shots are fired.|One shot is fired.] [1] falls over, dead.`,p=>{p[2].kill(p[1],`gun duel`);});
				new G.act(0.1,[coldBloodKiller+' handgun','- handgun !peaceful'],`[RED][1] and [2] duel it out, guns drawn.<br>Two shots are fired. [1] and [2] both fall over, dead.<br>Guess it's a tie.`,p=>{p[2].kill(p[1],`gun duel`);p[1].kill(p[2],`gun duel`);});
				new G.act(0.2,[coldBloodKiller+' handgun','- any'],`[1] fires [1:their] gun at [2], but misses...`);
			new G.act(0.4,[coldBloodKiller+' shotgun','- any'],`[RED][1] creeps up behind [2] and shoots [2:them] point-blank with [1:their] shotgun!`,p=>{p[1].kill(p[2],`shotgun`);});
				new G.act(0.2,[coldBloodKiller+' shotgun','- any'],`[1] fires [1:their] shotgun at [2], but misses...`);
			new G.act(0.4,[coldBloodKiller+' grenade','- any'],`[RED][1] tosses a live grenade at [2], who is instantly blown to smithereens!`,p=>{p[1].kill(p[2],`grenade`);p[1].lose('grenade');});
				new G.act(0.3,[coldBloodKiller+' grenade','- any','+ any'],`[RED][1] tosses a live grenade at a group of enemies.<br>[2] and [3] are caught in the explosion and are blown to smithereens!`,p=>{p[1].kill(p[2],`grenade`);p[1].kill(p[3],`grenade`);p[1].lose('grenade');});
				new G.act(0.3,[coldBloodKiller+' grenade','- any','+ any','+ any'],`[RED][1] tosses a live grenade at a group of enemies.<br>[2], [3] and [4] are caught in the explosion and are blown to smithereens!`,p=>{p[1].kill(p[2],`grenade`);p[1].kill(p[3],`grenade`);p[1].kill(p[4],`grenade`);p[1].lose('grenade');});
				new G.act(0.2,[coldBloodKiller+' grenade','- any','+ any','+ any','+ any'],`[RED][1] tosses a live grenade at a group of enemies.<br>[2], [3], [4], and [5] are caught in the explosion and are blown to smithereens!`,p=>{p[1].kill(p[2],`grenade`);p[1].kill(p[3],`grenade`);p[1].kill(p[4],`grenade`);p[1].kill(p[5],`grenade`);p[1].lose('grenade');});
			new G.act(0.3,[coldBloodKiller+' rocket_launcher','- any'],`[RED][1] fires a rocket at [2], who gets absolutely blown to bits.`,p=>{p[1].kill(p[2],`rocket launcher`);});
				new G.act(0.2,[coldBloodKiller+' rocket_launcher','- any','+ any'],`[RED][1] fires a rocket at a group of enemies.<br>[2] and [3] are caught in the explosion and are absolutely blown to bits.`,p=>{p[1].kill(p[2],`rocket launcher`);p[1].kill(p[3],`rocket launcher`);});
				new G.act(0.2,[coldBloodKiller+' rocket_launcher','- any','+ any','+ any'],`[RED][1] fires a rocket at a group of enemies.<br>[2], [3] and [4] are caught in the explosion and are absolutely blown to bits.`,p=>{p[1].kill(p[2],`rocket launcher`);p[1].kill(p[3],`rocket launcher`);p[1].kill(p[4],`rocket launcher`);});
				new G.act(0.1,[coldBloodKiller+' rocket_launcher','- any','+ any','+ any'],`[RED][1] fires a rocket at a group of enemies.<br>[2], [3], [4], and [5] are caught in the explosion and are absolutely blown to bits.`,p=>{p[1].kill(p[2],`rocket launcher`);p[1].kill(p[3],`rocket launcher`);p[1].kill(p[4],`rocket launcher`);p[1].kill(p[5],`rocket launcher`);});
			new G.act(0.4,[coldBloodKiller+' slingshot','- any'],`[1] uses [1:their] slingshot to pelt [2] with rocks, which is more annoying than anything, really.`);
			new G.act(0.4,[coldBloodKiller+' bow','- any'],`[RED][[1] spots [2] in the distance, and draws her bow. [1:g|His|Her|Their] arrow flies off, and pierces [2]'s|[1]'s arrow flies straight and true, piercing [2]'s] [heart|head|chest|stomach]!`,p=>{p[1].kill(p[2],`arrow`);});
				new G.act(0.2,[coldBloodKiller+' bow','- any'],`[1] fires an arrow at [2], but misses...`);
			new G.act(0.4,[coldBloodKiller+' flamethrower','- any'],`[RED]Armed with [1:their] flamethrower, [1] [incinerates|torches|burns] [2] to a crisp!`,p=>{p[1].kill(p[2],`flamethrower`);});
				new G.act(0.1,[coldBloodKiller+' flamethrower','- any','+ any'],`[RED]Armed with [1:their] flamethrower, [1] [incinerates|torches|burns] [2] and [3] to a crisp!`,p=>{p[1].kill(p[2],`flamethrower`);p[1].kill(p[3],`flamethrower`);});
				new G.act(0.3,[coldBloodKiller+' flamethrower','- flamethrower !peaceful'],`[RED][1] and [2] joyfully incinerate each other with their flamethrowers.<br>When the fire dies down, there's not much of them left...`,p=>{p[1].kill(p[2],`flamethrower duel`);p[2].kill(p[1],`flamethrower duel`);});
			new G.act(0.6,[coldBloodKiller+' lasergun','- any'],`[RED][1] shoots several white-hot holes in [2]'s body using [1:their] lasergun.`,p=>{p[1].kill(p[2],`lasergun`);});
				new G.act(0.2,[coldBloodKiller+' lasergun','- any'],`[1] shoots [1:their] lasergun at [2]! Good thing [1:they] can't aim...`);
			new G.act(0.6,[coldBloodKiller+' magic_wand','- any'],`[RED][1] gestures angrily towards [2] with [1:their] magic wand.<br>[2] only has time to feel [2:their] [blood turn to jelly|lungs turn into cauliflowers|blood vessels turn into spaghetti|major organs turn into various pastries|body temperature rising rapidly|brain hemispheres try to switch places|pancreas turn to cheese] before [2:g|he topples|she topples|they topple] over, dead.`,p=>{p[1].kill(p[2],`magic wand`);});
				new G.act(0.6,[coldBloodKiller+' magic_wand','- magic_wand !peaceful'],`[RED][1] and [2] have a merciless magic wand duel!<br>This goes on for a while until both of them explode in a splash of green.`,p=>{p[1].kill(p[2],`magic duel`);p[2].kill(p[1],`magic duel`);});
				new G.act(0.1,[coldBloodKiller+' magic_wand','- any','+ any'],`[RED][1] gestures angrily towards [2] and [3] with [1:their] magic wand.<br>It seems this switched some of their major organs, [2] inheriting [3]'s [spleen|kidneys|lungs|intestines|brain stem|uvula|eyelids|pancreas|bladder] and vice-versa. They both topple over, dead.`,p=>{p[1].kill(p[2],`magic wand`);p[1].kill(p[3],`magic wand`);});
				new G.act(0.1,['magic_wand'],`[RED][1] shakes [1:their] magic wand, but it seems it's used up the last of its magic.<br>The star at the tip has grown dull and useless; [1] tosses it aside.`,p=>{p[1].lose('magic wand');});
			new G.act(0.7,[coldBloodKiller+' ancient_scepter','- any'],`[RED][1] calls arcane fury down on [2], [1:their] ancient scepter beaming with an inner rage.<br>[[2] combusts into thousands of firey butterflies...|[2] vaporizes into a minty purple mist...|[2] grimaces, then starts bubbling violently, before melting into the ground.|For a second, nothing happens. [2] opens [2:their] mouth to say something, then starts peeling away, layer by layer.|At first, it seems nothing happened, until a light breeze blows [2] away like a pile of old dust.|[2] quivers strangely, then starts getting taller and taller, and thinner and thinner, until [2:g|he becomes just a line and disappears|she becomes just a line and disappears|they become just a line and disappear].]`,p=>{p[1].kill(p[2],`ancient scepter`);});
				new G.act(0.5,[coldBloodKiller+' ancient_scepter','- ancient_scepter !peaceful'],`[RED][1] and [2] have a merciless magic duel with their ancient scepters!<br>Sparks and bolts fly every which way, until both opponents suddenly bulge out and explode in a puff of acrid smoke.`,p=>{p[1].kill(p[2],`magic duel`);p[2].kill(p[1],`magic duel`);});
				new G.act(0.5,[coldBloodKiller+' !ancient_scepter magic_wand','- ancient_scepter !peaceful'],`[RED][1] challenges [2] to a magic duel with [1:their] magic wand!<br>Unfortunately for [1:them], [2] has an ancient scepter, and after a few colorful puffs and sparks, there's not much left of [1].`,p=>{p[2].kill(p[1],`magic duel`);});
			


			// Custom killing
			new G.act(0.5,[coldBloodKiller+' volleyball','- any'],`[RED][1] spikes [1:their] volleyball through [2]'s [head|stomach]!`,p=>{p[1].kill(p[2],`volleyball`);});
				new G.act(0.5,[coldBloodKiller+' volleyball','+ any','- any'],`[RED][2] sets the volleyball to [1] so [1:they] can spike it through [3]'s [head|chest|stomach|body]!`,p=>{p[1].kill(p[3],`volleyball`,p[2]);});
				new G.act(0.7,[coldBloodKiller+' volleyball_freak volleyball','- any'],`[RED][1] spikes [1:their] volleyball through [2]'s [head|stomach]!`,p=>{p[1].kill(p[2],`volleyball`);});

			new G.act(0.4,[coldBloodKiller+' knives','- any'],`[RED][1] throws [1:their] knives through [2]'s [head|stomach|chest|neck]!`,p=>{p[1].kill(p[2],`knives`);});
				new G.act(0.4,[coldBloodKiller+' knives','- any'],'[RED][1] stabs [2] in the back with their knife.',p=>{p[1].kill(p[2],`knives`);});
				new G.act(0.2,[coldBloodKiller+' knives','- knives'],`[RED][1] pushes [2] off a cliff during a knife fight.`,p=>{p[1].kill(p[2],`knives`);});
				new G.act(0.2,[coldBloodKiller+' knives','- knives'],`[RED][1] kills [2] during their knife fight!.`,p=>{p[1].kill(p[2],`knives`);});

			new G.act(0.11,[coldBloodKiller,'- any'],`[RED][1] tracks down and kills [2].`,p=>{p[1].kill(p[2],`murder`);});
				new G.act(0.09,[coldBloodKiller+' +',coldBloodKiller+' +','- any'],`[RED][1] and [2] track down and kill [3].`,p=>{p[1].kill(p[3],`murder`,p[2]);});
				new G.act(0.06,[coldBloodKiller,coldBloodKiller,coldBloodKiller,'- any'],`[RED][1], [2], and [3] track down and kill [4].`,p=>{p[1].kill(p[4],`murder`,[p[2],p[3]]);});
				new G.act(0.04,[coldBloodKiller,coldBloodKiller,coldBloodKiller,coldBloodKiller,'any'],`[RED][1], [2], [3], and [4] track down and kill [5].`,p=>{p[1].kill(p[5],`murder`,[p[2],p[3],p[4]]);});
				new G.act(0.02,[coldBloodKiller,coldBloodKiller,coldBloodKiller,coldBloodKiller,coldBloodKiller,'any'],`[RED][1], [2], [3], [4], and [5] track down and kill [6].`,p=>{p[1].kill(p[6],`murder`,[p[2],p[3],p[4],p[5]]);});

			new G.act(0.02,[coldBloodKiller+' +',coldBloodKiller+' +',coldBloodKiller+' +','-','+','+'],`[RED][1], [2], and [3] successfully ambush and kill [4], [5], and [6].`,p=>{p[1].kill(p[4],`murder`,[p[2],p[3]]);p[1].kill(p[5],`murder`,[p[2],p[3]]);p[1].kill(p[6],`murder`,[p[2],p[3]]);});
				new G.act(0.02,[coldBloodKiller+' +',coldBloodKiller+' +',coldBloodKiller+' +','-','+','+'],`[RED][1], [2], and [3] unsuccessfully ambush [4], [5], and [6], who kill them instead.`,p=>{p[4].kill(p[1],`retaliation`,[p[5],p[6]]);p[4].kill(p[2],`retaliation`,[p[5],p[6]]);p[4].kill(p[3],`retaliation`,[p[5],p[6]]);});
			new G.act(0.03,[coldBloodKiller,coldBloodKiller,coldBloodKiller,'','',''],`[RED][1], [2], and [3] successfully ambush and kill [4], [5], and [6].`,p=>{p[1].kill(p[4],`murder`,[p[2],p[3]]);p[1].kill(p[5],`murder`,[p[2],p[3]]);p[1].kill(p[6],`murder`,[p[2],p[3]]);});
				new G.act(0.03,[coldBloodKiller,coldBloodKiller,coldBloodKiller,'','',''],`[RED][1], [2], and [3] unsuccessfully ambush [4], [5], and [6], who kill them instead.`,p=>{p[4].kill(p[1],`retaliation`,[p[5],p[6]]);p[4].kill(p[2],`retaliation`,[p[5],p[6]]);p[4].kill(p[3],`retaliation`,[p[5],p[6]]);});

			new G.act(0.1,[coldBloodKiller + ' fighter|bulky','-'],`[RED][1] overpowers [2], killing [2:them].`,p=>{p[1].kill(p[2],`murder`);});

			new G.act(0.1,[coldBloodKiller + ' devious|sociopath','any'],`[RED][1] severely injures [2] and leaves [2:them] to die.`,p=>{p[1].kill(p[2],`murder`);});
				new G.act(0.1,[coldBloodKiller,'- any'],`[RED][1] severely injures [2] and leaves [2:them] to die.`,p=>{p[1].kill(p[2],`murder`);});


			new G.act(0.2,[coldBloodKiller+' wish_ring','- any'],`[RED][1] wishes [2] would disappear... [1:g|His|Her|Their] wish ring shimmers for a second, and then -<br>...nobody seems to remember [2] ever existed at all.`,p=>{p[1].kill(p[2],`ceased to exist`);});
			new G.act(0.1,['naive|peaceful|meek wish_ring'],`[RED][1] wishes [1:g|he wasn't|she wasn't|they weren't] here... [1:g|His|Her|Their] wish ring shimmers for a second, and then -<br>...nobody seems to remember [1] ever existed at all.`,p=>{p[1].kill(p[1],`ceased to exist`);});
			new G.act(0.02,['kind|peaceful wish_ring alive:>1'],`[BLUE][1] wishes people would get along! [1:g|His|Her|Their] wish ring shimmers for a second, and then -<br>...it seems the world has been made a softer place.`,p=>{
				for (var i in G.chars){G.chars[i].gain('peaceful');}
			});
			new G.act(0.05,['!devious|sociopath|survivalist wish_ring alive:1 dead:>0'],`[BLUE][1] wishes [1:g|he wasn't|she wasn't|they weren't] alone anymore... [1:g|His|Her|Their] wish ring shimmers for a second, and then -<br>...it's a miracle! Everybody's been brought back to life!`,p=>{
				for (var i in G.chars){G.chars[i].lose('dead');G.chars[i].gain('revived');}
			});
			new G.act(0.05,['!devious|sociopath|survivalist wish_ring','+ dead'],`[BLUE][1] wishes [1:they] could see [2] one last time... [1:g|His|Her|Their] wish ring shimmers for a second, and then -<br>...it's a miracle! [2] came back to life!`,p=>{p[2].lose('dead');p[2].gain('revived');});
			new G.act(0.2,['wish_ring'],`[1] wishes for [a cheeseburger|a nice hunk of cheese|a garden salad|some grilled fish|a delicious steak|a tall glass of milk|some cookies|a birthday cake|some trail mix|a popsicle|some pizza|a chicken dinner|some fried chicken|some yogurt|a really cool shirt|a new hat|a bag of chips|some candy|some marshmallows|some comic books|a rubber ducky]...<br>[1:g|His|Her|Their] wish ring shimmers for a second, and [1:their] wish materializes in front of [1:them].`);
			new G.act(0.1,['wish_ring'],`[1] wishes for [a longer nose|a shorter nose|bigger ears|really cool facial hair|really nice eyebrows|an interesting accent]...<br>[1:g|His|Her|Their] wish ring shimmers for a second before answering [1:their] wish.`);
			new G.act(0.1,['!survivalist wish_ring','+'],`[1] wishes for [2] to have [a longer nose|a shorter nose|bigger ears|really cool facial hair|really nice eyebrows|an interesting accent]...<br>Much to [2]'s surprise, [1]'s wish ring seems happy to comply.`);
			new G.act(0.1,['wish_ring'],`[1] tries to make a wish... [1:g|His|Her|Their] wish ring starts emitting a rancid smoke!<br>[1:g|He throws|She throws|They throw] it to the ground, where it fizzles and burns away in a crackling of angry sparkles.`,p=>{p[1].lose('wish ring');});
			
			new G.act(0.4,[coldBloodKiller,'- knight_armor any'],`[1] tries to kill [2], but [2]'s knight armor diverts the blow!`);
			new G.act(0.4,[coldBloodKiller,'- combat_gear any'],`[1] tries to kill [2], but [2]'s combat gear diverts the blow!`);
			new G.act(0.4,[coldBloodKiller,'- wizard_robe any'],`[1] tries to kill [2], but [2]'s wizard robe has already carried [2:them] away to safety!`);
			
			new G.act(0.4,['magic_wand','- !sheep'],`[BLUE]With a flick of [1:their] magic wand, [1] turns [2] into a sheep!`,p=>{p[2].gain('sheep');});
				new G.act(0.4,['ancient_scepter','- !sheep'],`[BLUE]With a flick of [1:their] ancient scepter, [1] turns [2] into a sheep!`,p=>{p[2].gain('sheep');});
				new G.act(1,['sheep'],`[1] is a sheep and [grazes peacefully|doesn't do much|baahs softly|glances away, a sad look in [1:their] eyes].`);
				new G.act(0.1,['sheep'],`[RED][1] is a sheep and [wanders off too far, becoming food for wild beasts|accidentally falls off a cliff while grazing].`,p=>{p[1].die(`sheep accident`);});
				new G.act(0.1,['!peaceful','sheep'],`[RED][1] decides to put [2] out of [2:their] sheep misery.`,p=>{p[1].kill(p[2],`sheep pity kill`);});
				new G.act(0.1,['peaceful|kind','sheep'],`[1] gently pets [2], who is a sheep.`);
			
			new G.act(0.3,['devious|sociopath|lunatic|survivalist','+ annoying'],`[RED][1] can't take it anymore and snaps [2]'s neck.`,p=>{p[1].kill(p[2],`too annoying to live`);});
			// new G.act(0.3,['suicidal'],`[RED][1] can't take it anymore...<br>[1] has taken [1:their] own life.`,p=>{p[1].kill(p[1],`suicide`);});
			// 	new G.act(0.3,['suicidal handgun'],`[RED][1] can't take it anymore...<br>[1] takes [1:their] own life with [1:their] handgun.`,p=>{p[1].kill(p[1],`handgun suicide`);});
			// 	new G.act(0.3,['suicidal shotgun'],`[RED][1] can't take it anymore...<br>[1] takes [1:their] own life with [1:their] shotgun.`,p=>{p[1].kill(p[1],`shotgun suicide`);});
			// 	new G.act(1,['suicidal alive:1'],`[RED][1] finds no point in being alive if [1:g|he's|she's|they're] the only one left.<br>[1] has taken [1:their] own life...`,p=>{p[1].kill(p[1],`suicide`);});
			// 	new G.act(0.5,['suicidal alive:1'],`[BLUE][1] is all alone. [1:g|He looks|She looks|They look] around, not a soul to be seen...<br>It's quite peaceful, actually.<br>[1] is no longer suicidal.`,p=>{p[1].lose('suicidal');});
			// 	new G.act(0.1,['!suicidal !survivalist|sociopath alive:1'],`[RED]There's nobody left except for [1]. What a bleak existence...<br>[1] is feeling suicidal.`,p=>{p[1].gain('suicidal');});
			
			new G.act(0.5,['survivalist !set_trap'],`[1] sets down a trap.`,p=>{p[1].gain('set trap');});
				new G.act(0.5,['!survivalist','set_trap'],`[RED][1] gets caught in one of [2]'s traps!<br>All [1:they] can do now is hope to be freed...`,p=>{p[2].lose('set trap');p[1].gain('trapped');});
				new G.act(0.1,['!survivalist','set_trap'],`[RED][1] gets caught in one of [2]'s traps... What a stupid mistake! [1:g|He|She|They] should have known better.<br>All [1:they] can do now is hope to be freed...`,p=>{p[2].lose('set trap');p[1].gain('trapped');});
				new G.act(0.5,['survivalist','- set_trap'],`[1] is smart enough to disarm one of [2]'s traps.`,p=>{p[2].lose('set trap');});
				new G.act(1,['trapped !bleeding_out any'],`[Still caught in the trap, [1] lays there, moping.|[1], still trapped, screams for help, but nobody answers...|[1] is still caught in the trap...|[1] is trapped and can't do anything.]`);
				new G.act(0.6,['trapped !bleeding_out any'],`[RED][1] was struggling in the trap and cut [1:themself] pretty bad.<br>[1] is now bleeding out!`,p=>{p[1].gain('bleeding out');});
				new G.act(1,['trapped bleeding_out any'],`[1] is trapped and slowly bleeding out...`);
				new G.act(0.5,['trapped bleeding_out any'],`[RED][1] finally dies from blood loss caused by the trap [1:g|he was|she was|they were] stuck in.`,p=>{p[1].die(`bled out in trap`);});
				new G.act(0.3,['!devious|survivalist','+ trapped any'],`[BLUE][1] finds [2] caught in a trap, and manages to free [2:them].`,p=>{p[2].lose('trapped');});
				new G.act(0.3,['!devious|survivalist peaceful|kind','- trapped any'],`[BLUE][1] feels sorry for [2] and frees [2:them] from the trap.`,p=>{p[2].lose('trapped');});
				new G.act(0.1,['trapped'],`[BLUE][1] manages to pull [1:themself] out of the trap!`,p=>{p[1].lose('trapped');});
			
			new G.act(0.5,['!trapped bleeding_out'],`[RED][1] dies from blood loss.`,p=>{p[1].die(`blood loss`);});
			
			new G.act(0.5,['sociopath|survivalist|devious','+ sociopath|survivalist|devious','+'],`[1] and [2] conspire against [3]...`);
				new G.act(0.2,['sociopath|survivalist|devious','+ sociopath|survivalist|devious','+'],`[RED]In an act of betrayal, [1] and [2] team up and [murder|eliminate|get rid of] [3]!`,p=>{p[1].kill(p[3],`betrayal`,p[2]);});
			new G.act(0.2,['survivalist','+ !survivalist'],`[RED][1] feels like [2] is slowing [1:them] down.<br>[1] [has murdered|got rid of|eliminated|did quick work of] [2]!`,p=>{p[1].kill(p[2],`betrayal`);});
			
			new G.act(0.3,['has_killed sociopath|devious|lunatic|unstable !peaceful|kind'],`[1] can't wait to kill again...`);
			new G.act(0.3,['has_killed peaceful|kind'],`[1] [feels horrible for what [1:they] did...|wishes [1:they] didn't have to kill anyone...|never wants to kill anyone ever again.]`);
			new G.act(0.3,['!has_killed peaceful|kind','+ has_killed'],`[1] still can't believe [2] killed someone...`);
			new G.act(0.3,['!devious|sociopath|survivalist','+ dead'],`[1] [reminisces about|thinks about|remembers|recalls something about|remembers how much [1:g|he misses|she misses|they miss]] [2] and sobs quietly.`);
			new G.act(0.3,['!devious|sociopath|survivalist alive:1'],`[1] [reminisces about|thinks about|remembers|remembers how much [1:g|he misses|she misses|they miss]] everybody and sobs quietly.`);
			
			new G.act(0.2,['has_killed dapper_suit'],`[1] washes the blood off of [1:their] dapper suit.`);
			new G.act(0.2,['has_killed knight_armor'],`[1] washes the blood off of [1:their] knight armor.`);
			new G.act(0.2,['has_killed combat_gear'],`[1] washes the blood off of [1:their] combat gear.`);
			new G.act(0.2,['has_killed wizard_robe'],`[1] washes the blood off of [1:their] wizard robe.`);

			
			new G.act(0.4,['!peaceful|kind pet_wolf','-'],`[RED][1] sics [1:their] pet wolf on [2]!<br>[2] gets torn to shreds by the ravenous animal!`,p=>{p[1].kill(p[2],`pet wolf`);});
			new G.act(0.4,['!peaceful|kind pet_tiger','-'],`[RED][1] sics [1:their] pet tiger on [2]!<br>[2] gets mauled to laces by the ravenous animal!`,p=>{p[1].kill(p[2],`pet tiger`);});
			new G.act(0.4,['!peaceful|kind pet_turtle','-'],`[RED][1] sics [1:their] pet turtle on [2]!<br>[2] gets stomped to bits. [2:g|He|She|They] never saw it coming...`,p=>{p[1].kill(p[2],`pet turtle`);});
			

			//accidents happen
			new G.act(0.1,['!survivalist any'],`[RED][1] [kind of wanders off and gets lost, never to be seen again.
				|wasn't looking and fell off a cliff...
				|eats something [1:they] shouldn't have and dies of horrible stomach pains.
				|gets mauled by wild animals.
				|trips and falls in a really bad way, breaking [1:their] neck.
				|falls into a frozen lake and drowns.
				|falls into a pit and dies.
				|attempts to climb a tree, but falls to [1:their] death.
				|unknowingly eats toxic berries.
			]`,p=>{p[1].die(`accident`);});

			// Custom kills (non items)
			new G.act(0.4,['scratched|bruised|cut_up|burnt'],`[RED][1] dies from an infection.`,p=>{p[1].die(`injuries`);});
			new G.act(0.4,['bleeding_out'],`[RED][1] bled out due to untreated injuries.`,p=>{p[1].die(`bled out`);});



			new G.act(0.05,['survivalist any'],`[RED][1] gets cocky and ends up dying from a stupid mistake.`,p=>{p[1].die(`stupid mistake`);});
			
			new G.act(0.01,['dead'],`[The [pile of flesh that used to be|dead husk of] [1]|[1]'s [corpse|lifeless body]] [[rots|festers|desiccates|decays|putrefies|decomposes] [peacefully|silently]|writhes with maggots].`);
			
			new G.act(0.01,['dead alive:0 dead:>1 any'],`[BLUE]A god comes upon this mess and revives everyone out of boredom.<br>How nice! Everybody's back.`,p=>{
				for (var i in G.chars){G.chars[i].lose('dead');G.chars[i].gain('revived');}
			});
			new G.act(0.03,['dead alive:0 dead:1 any'],`[BLUE]A god comes upon this mess and revives [1] out of boredom.<br>How nice!`,p=>{p[1].lose('dead');p[1].gain('revived');});
			
			new G.act(FORCE,['revived dead any'],`[1] was about to live again, but is, sadly, still dead.`,p=>{p[1].lose('revived');});
			
			// new G.act(FORCE,['revived !suicidal !dead every'],`[1] feels [1:themself], unsure what just happened. Guess [1:g|he's|she's|they're] alive again.`,p=>{p[1].lose('sheep');p[1].lose('revived');});
			// new G.act(FORCE,['revived suicidal !dead every'],`[1] feels [1:themself], unsure what just happened. Guess [1:g|he's|she's|they're] alive again.<br>Goddammit.`,p=>{p[1].lose('sheep');p[1].lose('revived');});
			
			/*
			//just a test
			new G.act(1,['','+'],``,p=>{
				var traitsList=[];
				for (var i in G.perks)
				{
					var me=G.perks[i];
					if (me.def && me.type=='trait') traitsList.push(me);
				}
				var me=new G.char({name:c(['Bob','Bub','Blob','Brob','Blib','Blug','Blab'])+c(['ert','urt','art','ard','by']),pic:c([p[1],p[2]]).pic,perks:[c(traitsList),c(traitsList)],gender:c([0,0,0,1,1,1,2])});
				me.join(p[1].team);
				
				return `[BLUE][1] and [2] decide to have a child!<br>They name the child <e>${me.name}</e>.`;
			});
			*/
			
			for (var i in G.acts)
			{
				var me=G.acts[i];
				if ((me.text.split('[').length-1)!=(me.text.split(']').length-1)) console.log(`Warning : brackets in the action "`,me.text,`" do not match.`);
			}
			
			// Arena Events

			G.eventActNames = [];
			G.eventActs = [];
			G.eventAct=function(catergory,people,text,func)
			{
				this.catergory = catergory;
				this.people = people;
				this.text = text;
				this.func=func||0;
				G.eventActs.push(this);
			}
				G.eventAct.prototype.fit=function(me)
				{					
					var selected=[];
					
					var prevTeam=0;
					for (var i=0;i<this.people.length;i++)
					{
						var req=this.people[i].split(' ');
						//if (req.indexOf('team')==-1 && req.indexOf('dead')==-1) req.unshift('!dead');
						
						var pool=[];
						if (req.indexOf('team')!=-1) pool=G.teams;
						else pool=G.chars;
						pool=shuffle(pool);
						if (i==0 && pool.indexOf(me)==-1) pool=[];
						
						var found=false;
						for (var ii=0;ii<pool.length;ii++)
						{
							var it=pool[ii];
							var fit=true;
							if (selected.indexOf(it)!=-1) {fit=false;continue;}
							if (i==0 && it!=me) {fit=false;continue;}
							if (i==0 && it.acted) {fit=false;continue;}
							
							var team=0;
							if (it.type=='team') team=it; else team=it.team;
							var forceSame=false;
							var forceDif=false;
							
							var able=true;
							var out=false;
							var any=req.indexOf('any')==-1?false:true;
							var every=req.indexOf('every')==-1?false:true;
							
							if (it.type!='team')
							{
								for (var iii in it.perks)
								{
									if (it.perks[iii].disable) able=false;
									if (it.perks[iii].out) out=true;
								}
							}
							
							//goal : [any] should give us both able and disabled, otherwise block disabled unless a perk calls it
							
							//filter for abnormal perks (we don't select people with those perks unless the req specifically calls for it)
							//todo : this doesn't match multiple choices like terrified|shell-shocked|dazed
							if (it.type!='team')
							{
								var tolerateDisabled=false;
								var tolerateOut=false;
								
								if (every) {tolerateDisabled=true;tolerateOut=true;}
								for (var iii in it.perks)
								{
									var perk=it.perks[iii];
									var needed=(req.indexOf(perk.name)!=-1);
									if (perk.disable && needed) {tolerateDisabled=true;}
									if (perk.out && needed) {tolerateOut=true;}
									if (!every && ((perk.disable && !any) || perk.out) && !needed) {fit=false;break;}
									//if (((perk.disable && !any) || perk.out) && req.indexOf(perk.name)==-1) {fit=false;break;}
								}
								if (!tolerateDisabled && !able && !any) fit=false;
								if (!tolerateOut && out) fit=false;
							}
							
							if (fit)
							{
								for (var iii=0;iii<req.length;iii++)
								{
									var bit=req[iii];
									var bitSplit=bit.split(':');
									var prop=bitSplit[0]?bitSplit[0]:0;
									var arg=bitSplit[1]?bitSplit[1]:0;
									if (!arg) prop=0;							

									if (bit=='') {}
									else if (bit=='team') {}
									else if (bit=='out') {if (!out){fit=false;break;}}
										else if (bit=='!out') {if (out){fit=false;break;}}
									else if (bit=='able') {if (!able){fit=false;break;}}
										else if (bit=='!able') {if (able){fit=false;break;}}
									else if (bit=='any') {}
									else if (bit=='every') {}
									else if (bit=='inTeam') {if (!it.team){fit=false;break;}}
									else if (bit=='noTeam') {if (it.team){fit=false;break;}}
									else if (bit=='+') {forceSame=true;forceDif=false;}
									else if (bit=='-') forceDif=true;
									else if (prop=='members'){if (!it.chars || !testCond(it.chars,arg)){fit=false;break;}}
									else if (prop=='alive')
									{
										var alive=0;
										for (var iiii in G.chars)
										{
											if (!G.chars[iiii].has('dead')) alive++;
										}
										if (!testCond(alive,arg)){fit=false;break;}
									}
									else if (prop=='dead')
									{
										var dead=0;
										for (var iiii in G.chars)
										{
											if (G.chars[iiii].has('dead')) dead++;
										}
										if (!testCond(dead,arg)){fit=false;break;}
									}
									else if (prop=='deaths'){if (!testCond(G.deaths,arg)){fit=false;break;}}
									else if (prop=='teamalive')
									{
										if (!team) {fit=false;break;}
										else
										{
											var alive=0;
											for (var iiii in team.chars)
											{
												if (!team.chars[iiii].has('dead')) alive++;
											}
											if (!testCond(alive,arg)){fit=false;break;}
										}
									}
									else if (prop=='teamdead' || prop=='teamdeaths')
									{
										if (!team) {fit=false;break;}
										else
										{
											var dead=0;
											for (var iiii in team.chars)
											{
												if (team.chars[iiii].has('dead')) dead++;
											}
											if (!testCond(dead,arg)){fit=false;break;}
										}
									}
									else if (it.type=='char')
									{
										//probably perk
										var neg=false;
										bit=bit.replaceAll('_',' ');
										if (bit.charAt(0)=='!')
										{
											bit=bit.substr(1);
											neg=true;
										}
										if (bit.indexOf('|')!=-1)//either
										{
											bit=bit.split('|');
											var hasAnyPerk=false;
											for (var iiii in bit)//this might be the first time i've reached iiii
											{
												if (it.has(bit[iiii])) {hasAnyPerk=true;break;}
											}
											if ((hasAnyPerk && neg) || (!hasAnyPerk && !neg)) {fit=false;break;}
										}
										else
										{
											var hasPerk=it.has(bit);
											if ((hasPerk && neg) || (!hasPerk && !neg)) {fit=false;break;}
										}
									}
								}
								
								if (i>0 && forceSame && (!team || team!=prevTeam)) fit=false;
								if (i>0 && forceDif && team && team==prevTeam) fit=false;
							}
							
							if (fit)
							{
								selected.push(it);
								prevTeam=team;
								found=it;
								break;
							}
						}
						if (!found) return false;
					}
					if (selected.length!=this.people.length) return false;
					return selected;
				}

			// #region Arena Events

			G.eventActNames.push("Dark Meta Knight's Revenge");
			new G.eventAct("Dark Meta Knight's Revenge",
				['any !dead'],
				`[BLUE]Dark Meta Knight has spared [1].`
			)
			new G.eventAct("Dark Meta Knight's Revenge",
				['any !dead alive:>1'],
				`[RED][1]'s soul was shattered by Dark Meta Knight!`,
				p=>{p[1].die(`Dark Meta Knight`);}
			)
			new G.eventAct("Dark Meta Knight's Revenge",
				['any !dead alive:>2','any !dead alive:>2'],
				`[RED]Dark Meta Knight simultaneously killed [1] and [2]!`,
				p=>{p[1].die(`Dark Meta Knight`); p[2].die(`Dark Meta Knight`);}
			)

			G.eventActNames.push("CUREY STORM");
			new G.eventAct("CUREY STORM",
				['any !dead'],
				`[BLUE]Curey has spared [1].`
			)
			new G.eventAct("CUREY STORM",
				['any !dead alive:>1'],
				`[RED][1] was killed by a flying basketball!`,
				p=>{p[1].die(`Curey`);}
			)
			new G.eventAct("CUREY STORM",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] tried to offer [2] to appease Curey. This fails and both are killed.`,
				p=>{p[1].die(`Curey`); p[2].die(`Curey`);}
			)

			G.eventActNames.push("CHAD BOMB");
			new G.eventAct("CHAD BOMB",
				['any !dead'],
				`[BLUE][1] managed to avoid the gas.`
			)
			new G.eventAct("CHAD BOMB",
				['any !dead alive:>1'],
				`[RED][1] suffocated as they laughed from the gas.`,
				p=>{p[1].die(`Chad`);}
			)
			new G.eventAct("CHAD BOMB",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] and [2] were both caught in the gas.`,
				p=>{p[1].die(`Chad`); p[2].die(`Chad`);}
			)

			G.eventActNames.push("Acid Rain");
			new G.eventAct("Acid Rain",
				['any !dead'],
				`[BLUE][1] survives.`
			)
			new G.eventAct("Acid Rain",
				['any !dead alive:>1'],
				`[RED][1] is unable to find shelter and dies.`,
				p=>{p[1].die(`Acid Rain`);}
			)
			new G.eventAct("Acid Rain",
				['any !dead alive:>1'],
				`[RED][1] trips face first into a puddle of acidic rain.`,
				p=>{p[1].die(`Acid Rain`);}
			)
			new G.eventAct("Acid Rain",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] injures [2] and leaves [2:them] in the rain to die.`,
				p=>{p[1].kill(p[2],`Acid Rain`);}
			)
			new G.eventAct("Acid Rain",
				['any devious|sociopath !dead alive:>2','any !dead alive:>2'],
				`[RED][1] refuses to give [2] shelter, killing [2:them].`,
				p=>{p[1].kill(p[2],`Acid Rain`);}
			)
			new G.eventAct("Acid Rain",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] shoves [2] into a pond of acidic rain, but [1:g|he is|she is|they are] pulled in by [2], killing both.`,
				p=>{p[1].die(`Acid Rain`); p[2].die(`Acid Rain`);}
			)

			G.eventActNames.push("Acid Rain");
			new G.eventAct("Acid Rain",
				['any !dead'],
				`[BLUE][1] survives.`
			)
			new G.eventAct("Acid Rain",
				['any !dead alive:>1'],
				`[RED][1] is unable to find shelter and dies.`,
				p=>{p[1].die(`Acid Rain`);}
			)
			new G.eventAct("Acid Rain",
				['any !dead alive:>1'],
				`[RED][1] trips face first into a puddle of acidic rain.`,
				p=>{p[1].die(`Acid Rain`);}
			)
			new G.eventAct("Acid Rain",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] injures [2] and leaves [2:them] in the rain to die.`,
				p=>{p[1].kill(p[2],`Acid Rain`);}
			)
			new G.eventAct("Acid Rain",
				['any devious|sociopath !dead alive:>2','any !dead alive:>2'],
				`[RED][1] refuses to give [2] shelter, killing [2:them].`,
				p=>{p[1].kill(p[2],`Acid Rain`);}
			)
			new G.eventAct("Acid Rain",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] shoves [2] into a pond of acidic rain, but [1:g|he is|she is|they are] pulled in by [2], killing both.`,
				p=>{p[1].die(`Acid Rain`); p[2].die(`Acid Rain`);}
			)

			G.eventActNames.push("Tornado");
			new G.eventAct("Tornado",
				['any !dead'],
				`[BLUE][1] survives.`
			)
			new G.eventAct("Tornado",
				['any !dead alive:>1'],
				`[RED][1] is sucked into the tornado.`,
				p=>{p[1].die(`Tornado`);}
			)
			new G.eventAct("Tornado",
				['any !dead alive:>1'],
				`[RED][1] is incapacitated by flying debris and dies.`,
				p=>{p[1].die(`Tornado`);}
			)
			new G.eventAct("Tornado",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] injures [2] and pushes [2:them] close enough to be sucked into the tornado.`,
				p=>{p[1].kill(p[2],`Tornado`);}
			)
			new G.eventAct("Tornado",
				['any devious|sociopath !dead alive:>2','any !dead alive:>2'],
				`[RED][1] pushes [2] into an oncoming boulder.`,
				p=>{p[1].kill(p[2],`Tornado`);}
			)
			new G.eventAct("Tornado",
				['any !dead alive:>2','any !dead alive:>2'],
				`[RED][1] tries to save [2] from being sucked into the tornado, only to be sucked in as well.`,
				p=>{p[1].die(`Tornado`); p[2].die(`Tornado`);}
			)

			G.eventActNames.push("Tracker Jackers");
			new G.eventAct("Tracker Jackers",
				['any !dead'],
				`[BLUE][1] survives.`
			)
			new G.eventAct("Tracker Jackers",
				['any !dead alive:>1'],
				`[RED][1] is stung to death.`,
				p=>{p[1].die(`Tracker Jackers`);}
			)
			new G.eventAct("Tracker Jackers",
				['any !dead alive:>1'],
				`[RED][1] slowly dies from the tracker jacker toxins.`,
				p=>{p[1].die(`Tracker Jackers`);}
			)
			new G.eventAct("Tracker Jackers",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] knocks [2] unconscious and leaves [2:them] there as bait.`,
				p=>{p[1].kill(p[2],`Tracker Jackers`);}
			)
			new G.eventAct("Tracker Jackers",
				['any devious|sociopath !dead alive:>2','any !dead alive:>2'],
				`[RED]While running away from tracker jackers, [1] grabs [2] and throws [2:them] to the ground.`,
				p=>{p[1].kill(p[2],`Tracker Jackers`);}
			)
			new G.eventAct("Tracker Jackers",
				['any !dead alive:>2','any !dead alive:>2'],
				`[RED][1] and [2] run out of places to run and are stung to death.`,
				p=>{p[1].die(`Tracker Jackers`); p[2].die(`Tracker Jackers`);}
			)

			G.eventActNames.push("Tsunami");
			new G.eventAct("Tsunami",
				['any !dead'],
				`[BLUE][1] survives.`
			)
			new G.eventAct("Tsunami",
				['any !dead alive:>1'],
				`[RED][1] is swept away.`,
				p=>{p[1].die(`Tsunami`);}
			)
			new G.eventAct("Tsunami",
				['any !dead alive:>1'],
				`[RED][1] fatally injures [1:g|himself|herself|themself] on debris.`,
				p=>{p[1].die(`Tsunami`);}
			)
			new G.eventAct("Tsunami",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] defeats [2] and throws [2:them] in the water to make sure [2:g|he dies|she dies|they die].`,
				p=>{p[1].kill(p[2],`Tsunami`);}
			)
			new G.eventAct("Tsunami",
				['any devious|sociopath !dead alive:>2','any !dead alive:>2'],
				`[RED][1] holds [2] underwater to drown.`,
				p=>{p[1].kill(p[2],`Tsunami`);}
			)
			new G.eventAct("Tsunami",
				['any !dead alive:>2','any !dead alive:>2'],
				`[RED][1] and [2] smash their heads together as the tsunami rolls in, leaving them both to drown.`,
				p=>{p[1].die(`Tsunami`); p[2].die(`Tsunami`);}
			)

			G.eventActNames.push("Monkey Mutts");
			new G.eventAct("Monkey Mutts",
				['any !dead'],
				`[BLUE][1] survives.`
			)
			new G.eventAct("Monkey Mutts",
				['any !dead alive:>1'],
				`[RED][1] dies from internal bleeding caused by a monkey mutt.`,
				p=>{p[1].die(`Monkey Mutts`);}
			)
			new G.eventAct("Monkey Mutts",
				['any !dead alive:>1'],
				`[RED][1] is pummeled and killed by a troop of monkey mutts.`,
				p=>{p[1].die(`Monkey Mutts`);}
			)
			new G.eventAct("Monkey Mutts",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] injures [2] and leaves [2:them] for the monkey mutts.`,
				p=>{p[1].kill(p[2],`Monkey Mutts`);}
			)
			new G.eventAct("Monkey Mutts",
				['any devious|sociopath !dead alive:>2','any !dead alive:>2'],
				`[RED][1] uses [2] as a shield from the monkey mutts.`,
				p=>{p[1].kill(p[2],`Monkey Mutts`);}
			)
			new G.eventAct("Monkey Mutts",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED]While running, [1] falls over and grabs [2] on the way down.<br>The monkey mutts kill them.`,
				p=>{p[1].die(`Monkey Mutts`); p[2].die(`Monkey Mutts`);}
			)

			G.eventActNames.push("Volcano");
			new G.eventAct("Volcano",
				['any !dead'],
				`[BLUE][1] survives.`
			)
			new G.eventAct("Volcano",
				['any !dead alive:>1'],
				`[RED][1] is buried in ash.`,
				p=>{p[1].die(`Volcano`);}
			)
			new G.eventAct("Volcano",
				['any !dead alive:>1'],
				`[RED][1] suffocates.`,
				p=>{p[1].die(`Volcano`);}
			)
			new G.eventAct("Volcano",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED][1] dips [1:their] weapon in lava and kills [2] with it.`,
				p=>{p[1].kill(p[2],`Volcano`);}
			)
			new G.eventAct("Volcano",
				['any devious|sociopath !dead alive:>2','any !dead alive:>2'],
				`[RED][1] pushes [2] in the lava.`,
				p=>{p[1].kill(p[2],`Volcano`);}
			)
			new G.eventAct("Volcano",
				['any !dead alive:>2','- any !dead alive:>2'],
				`[RED]As [1] trips over [2] into the lava, [1:g|he grabs [2] and pulls|she grabs [2] and pulls|they grab [2] and pull] [2:them] down with [1:them].`,
				p=>{p[1].die(`Volcano`); p[2].die(`Volcano`);}
			)

			// #endregion

			let actsList=shuffle(G.actsForced).concat(shuffle(G.actsOther));
			
			G.parse=function(text,actors)
			{
				/*
					syntax :
					'[1] looks at [2]'
						> names of people or teams
					'[1] looks at [1:g|himself|herself|themself]'
						> outputs one of the 3 options depending on gender
						> shortcuts : [1:they], [1:them], [1:their], [1:themself]
					'[1] [wanders|walks|skips] around'
						> outputs one of several options, at random
						> note that this can be nested, ie. '[1] [eats [cake|ice cream]|looks at [2]]'
				*/
				var input=text.split('');
				var out='';
				var tag='';
				var intag=0;
				
				for (var i in input)
				{
					if (input[i]=='[' && intag==0) {intag++;tag='';}
					else if (input[i]=='[' && intag>0) {intag++;tag+='[';}
					else if (input[i]==']' && intag>1) {intag--;tag+=']';}
					else if (input[i]==']' && intag==1)
					{
						if (tag=='RED'){out+='[RED]'}
						else if (tag=='BLUE'){out+='[BLUE]'}
						else if (tag=='YELLOW'){out+='[YELLOW]'}
						else if (tag=='GREEN'){out+='[GREEN]'}
						else if (tag.length>0)
						{
							var bits=tag.split('|');
							//if (!isNaN(bits[0]) && (tag.indexOf('|')==-1 || tag.indexOf(':')!=-1) && actors[parseInt(bits[0])-1])
							if (tag.indexOf('|')==-1 || tag.indexOf(':')!=-1)
							{
								var prop=0;
								if (bits[0].indexOf(':')!=-1){prop=bits[0].split(':')[1];bits[0]=bits[0].split(':')[0];}
								
								if (!isNaN(bits[0]) && actors[parseInt(bits[0])-1])
								{
									var actor=actors[parseInt(bits[0])-1];
									if (prop=='g')
									{
										out+=G.parse([bits[1],bits[2],bits[3]][actor.gender].replaceAll('{PIPE}','|').replaceAll('{COLON}',':'),actors);
									}
									else if (prop=='they') {out+=['he','she','they'][actor.gender];}
									else if (prop=='them') {out+=['him','her','them'][actor.gender];}
									else if (prop=='their') {out+=['his','her','their'][actor.gender];}
									else if (prop=='themself' || prop=='themselves') {out+=['himself','herself','themself'][actor.gender];}
									else out+='<e>'+actor.name+'</e>';
								}
								else out+='<e>[invalid actor : '+bits[0]+']</e>';
							}
							else if (tag.indexOf('|')!=-1)
							{
								out+=G.parse(c(bits).replaceAll('{PIPE}','|').replaceAll('{COLON}',':'),actors);
							}
							else out+='['+tag+']';
						}
						else out+='['+tag+']';
						intag=0;
						tag='';
					}
					else if (intag)
					{
						if (intag>1 && input[i]=='|') tag+='{PIPE}';
						else if (intag>1 && input[i]==':') tag+='{COLON}';
						else tag+=input[i];
					}
					else
					{
						var toAdd=input[i];
						out+=toAdd;
					}
				}
				return out;
			}
			
			//round
			G.round=0;
			G.nextRound=function()
			{
				window.scrollTo(0, 0); // Instnatly go to the top of the page to avoid spoilers!
				var actions=[];
				G.deadThisRound=[];
				
				var str='';
				
				for (var i in G.teams){G.teams[i].acted=false;}
				for (var i in G.chars){G.chars[i].acted=false;}
				
				var everybody=shuffle(G.teams).concat(shuffle(G.chars));

				// Right here seems like the best place to determine whether an arena event is happening or not
				// Maybe have cornucopia refill when there is only half of everyone left?

				var arenaEvent = Math.floor((Math.random() * 40) + 1); // generates 1 to 10

				let chosenEvent = "";
				if(arenaEvent == 1)
				{
					chosenEvent = shuffle(G.eventActNames)[0];
				}

				var time = 'none';
				if((G.round+1) % 2 == 0) time = 'night';
				else time = 'day';

				var peopleActed = [];
				for (var iAct=0;iAct<everybody.length;iAct++)
				{
					var me=everybody[iAct];
							
					// Make sure people aren't in 2 different actions
					var skip = false;
					for(var i in peopleActed)
					{
						if(me.name == peopleActed[i])
						{
							skip = true;
							break;
						}
					}
					if(skip) continue;

					// Start picking what act someone is going to do
					if (me.tier==0 || (Math.random()<1/5))
					{
						var acts=[];

						if(arenaEvent != 1)
						{
							for (var i in actsList)
							{
								var act=actsList[i];
								var loops=0;
								//chances over 1 add the act multiple times to the choice list
								if (act.chance>1) loops=Math.min(20,Math.floor(act.chance)+(Math.random()<(act.chance-Math.floor(act.chance))?1:0));
								else if (act.chance==FORCE || Math.random()<act.chance) loops=1;
								for (var ii=0;ii<loops;ii++)
								{
									if((act.tag == 'day' && time != 'day') || (act.tag == 'night' && time != 'night')) continue;
									acts.push(act);
								}
							}
							var choice=0;
							var actors=[];
							for (var i in acts)
							{
								var act=acts[i];
								actors=act.fit(me);//returns a random selection of people who match the act; the first person must be "me"
								if (actors)
								{
									// Make sure someone who has acted already is not targetted later
									var skip = false;
									for(var i in actors)
									{
										for(var j in peopleActed)
										{											
											if(actors[i].name == peopleActed[j])
											{
												skip = true;
												break;
											}
										}
										if(skip) break;
									}

									if(!skip)
									{
										choice=act;
										break;
									}
								}
							}
						}
						else // Choose an act from the event
						{
							var choice=0;
							var pastChoices = [];
							while(!choice)
							{
								if(pastChoices.length == G.eventActs.length)
								{
									break;
								}

								var randEvent = Math.floor(Math.random() * G.eventActs.length);

								for(var i in pastChoices)
								{
									if(pastChoices[i] == randEvent)
									{
										continue;
									}
								}
								pastChoices.push(randEvent);

								var event = G.eventActs[randEvent];
								if(event.catergory == chosenEvent)
								{									
									actors=event.fit(me);
									// Make sure someone who has acted already is not targetted later
									if(actors)
									{
										var skip = false;
										for(var i in actors)
										{
											for(var j in peopleActed)
											{											
												if(actors[i].name == peopleActed[j])
												{
													skip = true;
													break;
												}
											}
											if(skip) break;
										}
										if(!skip) choice = event;
									}									
								}
							}
						}
						
						if (choice)
						{
							if (choice.chance!=FORCE) {actsList.splice(actsList.indexOf(choice),1);actsList.push(choice);}//put it back at the end
							for (var i in actors)
							{
								peopleActed.push(actors[i].name)
							};
							if (actors.length>=1) actors[0].acted=true;
							var text=choice.text;
							var overrideText=0;
							choice.uses++;
							if (choice.func) overrideText=choice.func(([0]).concat(actors));
							var text=G.parse(overrideText||text,actors);
							var classes=[];
							if (text.indexOf('[RED]')!=-1) classes.push('red');
								text=text.replaceAll('[RED]','');
							if (text.indexOf('[BLUE]')!=-1) classes.push('blue');
								text=text.replaceAll('[BLUE]','');
							if (text.indexOf('[YELLOW]')!=-1) classes.push('yellow');
								text=text.replaceAll('[YELLOW]','');
							if (text.indexOf('[GREEN]')!=-1) classes.push('green');
								text=text.replaceAll('[GREEN]','');
							var action={chars:actors,text:text,classes:classes.join(' ')};
							actions.push(action);
							
							var pics='';
							var chars=[];
							for (var ii in action.chars)
							{
								if (action.chars[ii].type=='team')
								{
									for (var iii in action.chars[ii].chars)
									{
										if (chars.indexOf(action.chars[ii].chars[iii])==-1) chars.push(action.chars[ii].chars[iii]);
									}
								}
								else if (chars.indexOf(action.chars[ii])==-1) chars.push(action.chars[ii]);
							}
							for (var ii in chars)
							{
								pics+=`<img src="${chars[ii].pic}" class="pic" title="${chars[ii].name}"/>`;
								if (chars[ii].has('dead')) pics+=`<div class="picSkull"></div>`;
							}
							str+=`<div class="box action${action.classes?(' '+action.classes):''}"><div>${pics}</div><div>${action.text}</div></div>`;
						}
					}
				}
				
				if (!str) str=`<div class="box action"><div></div><div>(Absolutely nothing happened.)</div></div>`;
				G.logPos=0;
				G.log(str);
				G.updateLogButtons();
				
				G.round++;
				
				/*if (true)
				{
					var str2='';
					for (var i in actsList)
					{
						str2+=actsList[i].text+'<br>';
					}
					str+=`<div style="position:absolute;left:0px;top:0px;">${str2}</div>`;
				}*/
				
				l('round').innerHTML=str;
				/*var nodes=l('round').getElementsByClassName('action');
					for (var i=nodes.length-1;i>=0;i--){animRemove(nodes[i]);}
				l('round').insertAdjacentHTML('afterbegin',str);*/
				if (!G.autoroundOn)
				{
					var nodes=l('round').getElementsByClassName('action');
					for (var i=nodes.length-1;i>=0;i--){animAdd(nodes[i]);}
				}
				var str='';
				var dead=0,alive=0,others=0;
				for (var i in G.chars)
				{
					var me=G.chars[i];
					if (me.has('dead')) dead++;
					else if (me.has('ghost') || me.has('zombie')) others++;
					else alive++;
				}
				str+=`Alive : ${alive} | Dead : ${dead}`;
				if (others>0) str+=` | Other : ${others}`;
				l('roundStats').innerHTML=str;
				
				var roundMessage = 'Round '+G.round;
				if(chosenEvent != '')
				{
					roundMessage += ' | ' + chosenEvent
				}
				l('roundN').innerHTML=roundMessage;

				if (alive==0)
				{
					if (G.chars.length==0) l('everyoneDeadDetails').innerHTML=`There's literally nobody here, dead or alive.`;
					else l('everyoneDeadDetails').innerHTML=`Everyone is dead.`;
					l('everyoneDead').style.display='block';
				}
				else l('everyoneDead').style.display='none';
				
				if (G.deadThisRound.length>0)
				{
					var str=`<header>Died this round :</header>`;
					str+=`<div style="font-size:12px;"><cap>`;
						var chars=G.deadThisRound;
						for (var i=0;i<chars.length;i++)
						{
							str+=`<div style="display:inline-block;padding:4px 16px;"><img src="${chars[i].pic}" class="pic intext" title="${chars[i].name}"/> <e style="color:#e2461f;">${chars[i].name}</e>`;
								if (chars[i].killer.length>0) str+=`, <span style="font-size:80%;">killed by <b>${chars[i].killer.map(killer=>killer.name).join(', ')}</b> (${chars[i].deathReason})</span>`;
								else str+=` <span style="font-size:80%;">(${chars[i].deathReason})</span>`;
							str+=`</div>`;
						}
					str+=`</cap></div>`;
					l('deadThisRound').innerHTML=str;
					l('deadThisRound').style.display='block';
				}
				else l('deadThisRound').style.display='none';
				
				var end=false;
				
				if (alive>0)
				{
					var teamsAlive=[];
					var soleSurvivor=0;
					for (var i in G.chars)
					{
						var me=G.chars[i];
						if (me.has('dead')) {}
						else if (me.has('ghost') || me.has('zombie')) {}
						else
						{
							soleSurvivor=me;
							if (me.team && teamsAlive.indexOf(me.team)==-1) teamsAlive.push(me.team);
						}
					}
					if (G.chars.length>1 && alive==1)
					{
						l('soleSurvivor').style.display='block';
						l('soleSurvivorDetails').innerHTML=`<div>Everyone is dead except <e>${soleSurvivor.name}</e>${soleSurvivor.team?(' from <e>'+soleSurvivor.team.name+'</e>'):''}, who stands as the sole survivor.</div>`;
						end=true;
					}
					else if (G.teams.length>1 && teamsAlive.length==1)
					{
						l('soleSurvivor').style.display='block';
						l('soleSurvivorDetails').innerHTML=`<div><e>${teamsAlive[0].name}</e> emerges as the victorious team. Everyone else is dead.</div>`;
						end=true;
					}
					else l('soleSurvivor').style.display='none';
				}
				else
				{
					end=true;
					l('soleSurvivor').style.display='none';
				}
				
				if (end)
				{
					var str=`<header>Tally</header>`;
					str+=`<div style="font-size:12px;"><cap>`;
					//display:flex;flex-direction:column;flex-wrap:wrap;justify-content:flex-start;align-content:stretch;align-items:stretch;
						var chars=G.chars.slice(0);
						chars=chars.sort((a,b)=>a.placement-b.placement); // Sort by their placement rather than their kills
						for (var i=0;i<chars.length;i++)
						{
							str+=`<div style="display:inline-block;padding:4px 16px;${i==0?'font-size:150%;':i<(Math.min(chars.length/2,3))?'font-size:125%;':''}"><img src="${chars[i].pic}" class="pic intext" title="${chars[i].name}"/> <b>#${i+1}</b> : <e>${chars[i].name}</e>${chars[i].has('dead')?'<span style="color:#e2461f;">&dagger;</span>':''}, <span style="font-size:80%;">with <b>${chars[i].kills.length==0?'no kills':chars[i].kills.length==1?'<span style="color:#e2461f;">1 kill</span>':('<span style="color:#e2461f;">'+chars[i].kills.length+' kills</span>')}</b></span></div>`;
						}
					str+=`</cap></div>`;
					l('tally').innerHTML=str;
					l('tally').style.display='block';

				}
				else l('tally').style.display='none';
			}
			
			l('main').innerHTML=`
				<div class="box red" id="summary">
					<div>A horrible struggle for survival is taking place.</div>
				</div>
				<div style="text-align:left;overflow:hidden;"><div class="button" id="backToCreator">&lt; Go back to team setup</div><div class="button" id="exportSetup">Export initial setup...</div><div class="button" id="exportGame">Export this game...</div><span style="float:right;"><div class="button" id="viewDetails">Details...</div><div class="button" id="nextRound2">Next round &gt;</div></span></div>
				<header id="roundN"></header>
				<div style="height:23px;margin-top:-30px;margin-bottom:11px;clear:both;overflow:hidden;">
					<div class="button" id="logBackFull" style="float:left;">&lt; &lt;</div>
					<div class="button" id="logBack" style="float:left;">&lt; View previous round</div>
					<div class="button" id="logForwardFull" style="float:right;">&gt; &gt;</div>
					<div class="button" id="logForward" style="float:right;">View next round &gt;</div>
				</div>
				<div id="round"></div>
				<div class="box" id="deadThisRound" style="display:none;text-align:center;background:rgba(0,0,0,0.5);"></div>
				<div class="box red" id="everyoneDead" style="display:none;">
					<div id="everyoneDeadDetails"></div>
					<div>You may want to <div class="button" id="backToCreator2">Go back to team setup</div>.</div>
				</div>
				<div class="box blue" id="soleSurvivor" style="display:none;">
					<div id="soleSurvivorDetails"></div>
					<div>You may want to <div class="button" id="backToCreator3">Go back to team setup</div>, or keep going until no one is left alive.</div>
				</div>
				<div class="box" id="tally" style="display:none;text-align:center;background:rgba(0,0,0,0.5);"></div>
				<header>
					<div style="font-size:10px;" id="roundStats"></div>
					<div class="button bigButton" id="nextRound">Next round</div>
				</header>
			`;
			
			addEvent(l('nextRound'),'click',function(){G.nextRound();});
			addEvent(l('nextRound2'),'click',function(){G.nextRound();});
			addEvent(l('viewDetails'),'click',function(){G.viewDetails();});
			addEvent(l('backToCreator'),'click',function(){G.creator();});
			addEvent(l('backToCreator2'),'click',function(){G.creator();});
			addEvent(l('backToCreator3'),'click',function(){G.creator();});
			addEvent(l('exportSetup'),'click',function(){G.exportSetup(G.setupData);});
			addEvent(l('exportGame'),'click',function(){G.exportGame();});
			
			addEvent(l('logBack'),'click',function(){G.logBack();});
			addEvent(l('logBackFull'),'click',function(){G.logBack(true);});
			addEvent(l('logForward'),'click',function(){G.logForward();});
			addEvent(l('logForwardFull'),'click',function(){G.logForward(true);});
			
			if(!G.importedGame) G.roundLog=[];
			G.logPos=0;//how many rounds back we are
			G.updateLogButtons=function()
			{
				if (!G.roundLog[G.logPos+1]) {l('logBack').style.display='none';l('logBackFull').style.display='none';} else {l('logBack').style.display='inline-block';l('logBackFull').style.display='inline-block';}
				if (!G.roundLog[G.logPos-1]) {l('logForward').style.display='none';l('logForwardFull').style.display='none';} else {l('logForward').style.display='inline-block';l('logForwardFull').style.display='inline-block';}
			}
			G.log=function(str)
			{
				G.roundLog.unshift(str);
				if (G.roundLog.length>=52) G.roundLog.pop();
			}
			G.logBack=function(full)
			{
				var str=G.roundLog[G.logPos+1]||0;
				if (full) str=G.roundLog[G.roundLog.length-1]||0;
				if (!str) return false;
				G.logPos++;
				if (full) G.logPos=G.roundLog.length-1;
				l('round').innerHTML=str;
				l('roundN').innerHTML='Round '+(G.round-G.logPos)+' ('+(G.logPos>0?('archive level -'+G.logPos):'current')+')';
				G.updateLogButtons();
			}
			G.logForward=function(full)
			{
				var str=G.roundLog[G.logPos-1]||0;
				if (full) str=G.roundLog[0]||0;
				if (!str) return false;
				G.logPos--;
				if (full) G.logPos=0;
				l('round').innerHTML=str;
				l('roundN').innerHTML='Round '+(G.round-G.logPos)+' ('+(G.logPos>0?('archive level -'+G.logPos):'current')+')';
				G.updateLogButtons();
			}
			
			if(!G.importedGame) G.nextRound();
		}
		
		G.autoroundOn=false;
		G.autoroundT=100;
		G.autoround=function(t)
		{
			if (t) G.autoroundT=Math.max(t*1000,10); else G.autoroundT=100;
			if (!G.started) G.start();
			G.autoroundOn=!G.autoroundOn;G.autoroundLoop();
		}
		G.autoroundLoop=function()
		{
			if (G.autoroundOn)
			{
				G.nextRound();
				setTimeout(G.autoroundLoop,G.autoroundT);
			}
		}
		
		G.creator();
	},
};

if (!G.launched) G.init();