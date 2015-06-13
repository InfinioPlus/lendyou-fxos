$(document).ready(function(){
    if('mozApps' in navigator) {
        var manifest_url = location.href + 'manifest.webapp';
        var installCheck = navigator.mozApps.checkInstalled(manifest_url);
        
        installCheck.onsuccess = function() {
            if(installCheck.result) {
                $('#install-row').hide();
            } else {
                $('#install-btn').click(function(ev){
                    ev.preventDefault();
                    
                    var installLocFind = navigator.mozApps.install(manifest_url);
                    
                    installLocFind.onsuccess = function(data) {};
                    
                    installLocFind.onerror = function() {
                        alert(installLocFind.error.name);
                    };
                });
            };
        };
    } else{
        $('#install-row').hide();
    }
});