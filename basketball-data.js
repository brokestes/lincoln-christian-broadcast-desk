(function () {
  "use strict";
  // The authenticated Hudl screen showed this player list. Lincoln has not yet played a verified 2026–27 game,
  // so no season totals, averages, or athlete stats are stored. This is not an official LCS roster release.
  window.LincolnBasketball = { version: 2, data: {
    "girls-basketball": {
      teamName:"Lincoln Christian", season:"2026-27", games:0, checkedAt:"2026-11-01T18:45:00-05:00",
      source:"https://www.hudl.com/reports/teams/162299/stats", sourceName:"Hudl player list (unconfirmed roster)",
      roster:[["0","Ivey Wheeler"],["1","Lauren Still"],["3","Presli Roberts"],["4","Azariah Woodruff"],["12","Niya Willoby"],["20","Emery Wheeler"],["22","Leah Moore"],["25","Jayla Albert"],["31","Hayleigh Michalec"],["","Ellsie Holloway"],["","Emma Williams"],["","Layne Lovelle"],["","Noelle Lagow"],["","Reese Nelson"],["","Sally Pritchard"],["","Sam Lofstrom"]].map(function(p,i){return{id:"gb-hudl-"+i,number:p[0],name:p[1],grade:"",position:"",source:"Hudl player list — needs Lincoln confirmation"};}),
      team:{totals:{pf:"",pa:"",fgm:"",fga:"",fgPct:"",threeM:"",threeA:"",threePct:"",ftm:"",fta:"",ftPct:"",oreb:"",dreb:"",reb:"",ast:"",turnovers:"",steals:"",blocks:"",charges:"",fouls:""},averages:{pf:"",pa:"",fgm:"",fga:"",fgPct:"",threeM:"",threeA:"",threePct:"",ftm:"",fta:"",ftPct:"",oreb:"",dreb:"",reb:"",ast:"",turnovers:"",steals:"",blocks:"",charges:"",fouls:""}},
      players:[["0","Ivey Wheeler"],["1","Lauren Still"],["4","Azariah Woodruff"],["12","Niya Willoby"],["22","Leah Moore"],["25","Jayla Albert"],["31","Hayleigh Michalec"]].map(function(p){return{number:p[0],name:p[1]};})
    }
  }, forSport:function(sport){return this.data[sport]||null;} };
}());