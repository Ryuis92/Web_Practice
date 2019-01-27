
function myroute(app, handlers)
{
  for(var handle in handlers){
      app.get(handle, handlers[handle]);
  }
}

exports.myroute = myroute;
