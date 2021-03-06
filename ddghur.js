init();

function init(){
    let ddghurStorage = browser.storage.local.get();
    ddghurStorage.then(function(res){
        ddghurBlockedDomainsArr = (res.ddghurBlockedDomains !== undefined) ? res.ddghurBlockedDomains : []; 
        ddghurOptions = (res.ddghurOptions !== undefined) ? res.ddghurOptions : {};
        hideResults(ddghurBlockedDomainsArr);
        addHideShowResultsForDomainLink();
    });
}

function hideResults(blockedDomains){
    function hideResult(el){
        el.add("hideResult");

        if(('showedHiddenResults' in ddghurOptions) && ddghurOptions.showedHiddenResults === true) {
            el.add("enabled");
        }

        if(('animations' in ddghurOptions) && ddghurOptions.animations === false) {
            el.add("no-animations");
        }
    }

    let results = document.querySelectorAll(".results .result:not(.result--sep):not(.result--more)");
    for(let i=0; i<results.length; i++){
        var url = results[i].getElementsByTagName('a')[0].getAttribute("href");
        if(!!ddghurOptions.hideHTTP&& !url.startsWith("https://")){
            hideResult(results[i].classList);
        } 
        else{
            for(let j=0; j<blockedDomains.length; j++){
                let re = new RegExp(blockedDomains[j], "i");
                if(results[i].dataset.domain.match(re) !== null){
                    hideResult(results[i].classList);
                } 
            }
        }        
    }
}

function deleteFromBlockedDomainsArr(domain){
    console.log("Delete '"+ domain +"' from blocked domains list");
}

function addToBlockedDomainsArr(domain){
    console.log("Add '"+ domain +"' to blocked domains list");
    let ddghurStorage = browser.storage.local.get();
    ddghurStorage.then(function(res){
        let ddghurBlockedDomainsArr = (res.ddghurBlockedDomains !== undefined) ? res.ddghurBlockedDomains : []; 
        ddghurBlockedDomainsArr.push(domain);
        var storingDomain = browser.storage.local.set({ ddghurBlockedDomains : ddghurBlockedDomainsArr });
        init();
    });
}

function hideResultLink(e){
    e.preventDefault();
    e.stopImmediatePropagation();
    addToBlockedDomainsArr(this.dataset.domain);  
    this.innerText = "Done!";
}

function addHideShowResultsForDomainLink(){
    let results = document.querySelectorAll(".results .result:not(.result--sep):not(.result--more):not(.hideResult)");
    for(let i=0; i<results.length; i++){
        let resultUrl = results[i].querySelector(".result__body .result__extras");
        let resultHasHideLink = results[i].querySelectorAll(".hideShowLink");
        if(resultHasHideLink.length>0)
            continue;
        let resultDomain = results[i].dataset.domain;
        let link = document.createElement("a");
        link.title = "Hide results from "+resultDomain
        link.dataset.domain = resultDomain;
        link.classList.add("hideShowLink");
        let linkTxt = document.createTextNode("Hide results");
        link.appendChild(linkTxt);
        resultUrl.appendChild(link);
        link.addEventListener("click",hideResultLink,false);        
    }
}

var target = document.getElementById('links');
var observer = new MutationObserver(function(mutations) {
    init(); 
});
var config = {childList: true};
observer.observe(target, config);
