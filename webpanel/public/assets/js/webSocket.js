var socket = io();

/* Update status of one Shard */
socket.on('updateShardState', msg => {
    var json = JSON.parse(msg);
    if(json.state == 'error') {
        $("#shard-" + json.id).addClass('error');
        $("#shard-" + json.id).removeClass('success');
    } else {
        $("#shard-" + json.id).addClass('success');
        $("#shard-" + json.id).removeClass('error');

    }
    $("#shard-" + json.id).text("Shard #" + (parseInt(json.id) + 1) + " - " + json.message);
    socket.emit('requestOfflineShardCount');
});

/* Update x shards are offline bar */
socket.on('updateOfflineShardCount', offlineShards => {
    if(offlineShards == 0){
        $("#all-shards").addClass('success');
        $("#all-shards").removeClass('error');
        $("#all-shards").text("All shards operational!");
    } else {
        $("#all-shards").addClass('error');
        $("#all-shards").removeClass('success');
        if(offlineShards == 1) {
            $("#all-shards").text(`${offlineShards} shard is experiencing issues!`);
        } else {
            $("#all-shards").text(`${offlineShards} shards are experiencing issues!`);
        }
    }
});