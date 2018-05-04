var json2csv = require('json2csv');
 
exports.get = function(req, res) {

    var fields = [
        'subject',
        'semester',
        'notebook.id',
        'notebook.title',
        'notebook.description',
        'notebook.video.title',
        'notebook.video.link',
        'notebook.career.title',
        'notebook.career.link',
        'notebook.detailsLink',
        'notebook.mathSkill'
    ];
 
    var csv = json2csv({ data: '', fields: fields });
 
    res.set("Content-Disposition", "attachment;filename=lessons.csv");
    res.set("Content-Type", "application/octet-stream");
 
    res.send(csv);
 
};