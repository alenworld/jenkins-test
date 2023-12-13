type Relation<name, id, rel, relations> = name extends relations ? rel : id;

export default Relation;
