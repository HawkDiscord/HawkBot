var socket = io();

socket.emit('requestShardStatus');

/* Update status of one Shard */
socket.on('shardStatusUpdate', shard => {
    if(status == 0) {
        $('#shard-' + shard.id).addClass('success');
        $('#shard-' + shard.id).removeClass('error');
    } else {
        $('#shard-' + shard.id).addClass('error');
        $('#shard-' + shard.id).removeClass('success');

    }
    $('#shard-' + shard.id).text(getMessage(shard.status));
    socket.emit('requestOfflineShardCount');
});

/* Update x shards are offline bar */
socket.on('updateOfflineShardCount', offlineShards => {
    if(offlineShards == 0){
        $('#all-shards').addClass('success');
        $('#all-shards').removeClass('error');
        $('#all-shards').text('All shards operational!');
    } else {
        $('#all-shards').addClass('error');
        $('#all-shards').removeClass('success');
        if(offlineShards == 1) {
            $('#all-shards').text(`${offlineShards} shard is experiencing issues!`);
        } else {
            $('#all-shards').text(`${offlineShards} shards are experiencing issues!`);
        }
    }
});

function getMessage(status) {
    switch(status) {
        case '0':
            return 'Operational';
    }
}