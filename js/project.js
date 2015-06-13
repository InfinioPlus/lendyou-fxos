$(document).ready(function(){
    $('.input-group.date').datepicker({
    });
    
    $('#new-lend').hide();
    
    $('#new-lend-btn').click(function(){
        $('#new-lend').show();
    });
    
    $('#close-btn').click(function(){
        $('#lendwhat-txt').val('');
        $('#lendto-txt').val('');
        $('#lendwhen-txt').val('');
        $('#new-lend').hide();
    });
    
    $('#lend-btn').click(function(){
        databaseExists();
        addLend($('#lendwhat-txt').val(), $('#lendto-txt').val(), $('#lendwhen-txt').val());
    });
    
    function databaseExists(){
        var request = indexedDB.open('lendyou6');
 
        request.onupgradeneeded = function(e)
        {
            var idb = e.target.result;
            
                if (!idb.objectStoreNames.contains('lend'))
                {
                    var store = idb.createObjectStore('lend', {KeyPath: 'Id', autoIncrement: true});
                    store.createIndex('lendwhat', 'lendwhat', {unique: false});
                    store.createIndex('lendto', 'lendto', {unique: false});
                    store.createIndex('lendwhen', 'lndwhen', {unique: false});
                }
        }
    }
    
    function addLend(what, who, when){
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
        var openCopy = indexedDB && indexedDB.open;
 
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
 
        if (IDBTransaction)
        {
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
        }
        
        var request = indexedDB.open('lendyou6');
 
        request.onsuccess = function(e)
        {
            var idb = e.target.result;
            var trans = idb.transaction('lend', IDBTransaction.READ_WRITE);
            var store = trans.objectStore('lend');
         
            var requestAdd = store.add({lendwhat: what, lendto: who, lendwhen: when});
         
            requestAdd.onsuccess = function(e) {
                alert('Lend added successfully');
            };
         
            requestAdd.onfailure = function(e) {
                alert('Failed to add lend: ' + e);
            };
        };
    }
});