const Json2csvParser = require('json2csv').Parser;

exports.get = function (req, res) {

    const fields = [
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
        'notebook.mathSkill',
        'notebook.image'
    ];

    const myData = { "notebook" : { "video" : { "title" : "video 16", "link" : "video url 16" }, "career" : { "title" : "career 16", "link" : "careel url 16" }, "id" : 16, "title" : "Title 16", "description" : "Description 16", "detailsLink" : "notebook details link 16", "mathSkill" : "math skill 16" }, "subject" : "MB", "semester" : 2};

    const opts = { fields };

    try {
        //const csv = new jsontocsv(fields).parse;
        //const csv = parser.parse(myData);
        const parser = new Json2csvParser(opts);
        const csv = parser.parse(myData);
        console.log(csv);       
        
        res.set("Content-Disposition", "attachment;filename=lessons.csv");
        res.set("Content-Type", "application/octet-stream");
    
        res.send(csv);
       } catch (err) {
        console.error(err);
    }

    /*
  const csv = jsontocsv({ data: '', fields: fields });
  */

 
};