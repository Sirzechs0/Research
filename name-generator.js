// Filipino Student Name Generator
const NameGenerator = {
    firstNamesMale: [
        'Aaron', 'Adrian', 'Aiden', 'Alex', 'Angelo', 'Anthony', 'Axel',
        'Benedict', 'Benjamin', 'Brandon', 'Bryan', 'Carlo', 'Carlos', 'Christian',
        'Christopher', 'Daniel', 'David', 'Dominic', 'Dylan', 'Elijah', 'Emmanuel',
        'Ethan', 'Gabriel', 'Gian', 'Ian', 'Jacob', 'James', 'Jason', 'Jayden',
        'Jerome', 'John', 'Jonathan', 'Joseph', 'Joshua', 'Justin', 'Keith',
        'Kenneth', 'Kevin', 'Kyle', 'Lance', 'Lorenzo', 'Lucas', 'Luis', 'Luke',
        'Marcus', 'Mark', 'Matthew', 'Michael', 'Nathan', 'Neil', 'Nicholas',
        'Patrick', 'Paul', 'Peter', 'Rafael', 'Raphael', 'Ryan', 'Samuel', 'Sebastian',
        'Sean', 'Stefan', 'Steven', 'Vincent', 'Zach', 'Zachary'
    ],
    
    firstNamesFemale: [
        'Abigail', 'Alexa', 'Alexandra', 'Alyssa', 'Andrea', 'Angela', 'Angelica',
        'Angelina', 'Anna', 'Ashley', 'Athena', 'Bianca', 'Camille', 'Catherine',
        'Charlotte', 'Chloe', 'Christine', 'Claire', 'Danielle', 'Diana', 'Ella',
        'Emily', 'Emma', 'Erica', 'Faith', 'Francesca', 'Gabriella', 'Grace',
        'Hannah', 'Isabella', 'Isabelle', 'Jasmine', 'Jessica', 'Julia', 'Kaitlyn',
        'Kate', 'Katherine', 'Katrina', 'Kristen', 'Laura', 'Lauren', 'Leah',
        'Liana', 'Lily', 'Maria', 'Melissa', 'Michelle', 'Mia', 'Natalie', 'Nicole',
        'Olivia', 'Patricia', 'Rachel', 'Rebecca', 'Samantha', 'Sarah', 'Sophia',
        'Stephanie', 'Victoria', 'Ysabella', 'Zoe'
    ],
    
    lastNames: [
        'Abad', 'Aguilar', 'Alvarez', 'Aquino', 'Bautista', 'Beltran', 'Bernardo',
        'Cabrera', 'Castillo', 'Castro', 'Cruz', 'De Guzman', 'De Jesus', 'De la Cruz',
        'Del Rosario', 'Diaz', 'Domingo', 'Espiritu', 'Fernandez', 'Flores', 'Garcia',
        'Gomez', 'Gonzales', 'Gutierrez', 'Hernandez', 'Jimenez', 'Lim', 'Lopez',
        'Manalo', 'Marquez', 'Martinez', 'Mendoza', 'Miranda', 'Morales', 'Navarro',
        'Ocampo', 'Ortiz', 'Padilla', 'Pascual', 'Perez', 'Ramos', 'Reyes', 'Rivera',
        'Rodriguez', 'Romero', 'Rosario', 'Sanchez', 'Santiago', 'Santos', 'Silva',
        'Soriano', 'Tan', 'Torres', 'Valdez', 'Velasco', 'Villa', 'Villanueva'
    ],
    
    middleInitials: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    
    generateName: function(gender, usedNames = new Set()) {
        let attempts = 0;
        let name;
        
        do {
            const firstName = gender === 'M' 
                ? this.firstNamesMale[Math.floor(Math.random() * this.firstNamesMale.length)]
                : this.firstNamesFemale[Math.floor(Math.random() * this.firstNamesFemale.length)];
            
            const lastName = this.lastNames[Math.floor(Math.random() * this.lastNames.length)];
            const middleInitial = this.middleInitials[Math.floor(Math.random() * this.middleInitials.length)];
            
            name = `${lastName}, ${firstName} ${middleInitial}.`;
            attempts++;
            
            if (attempts > 100) break; // Prevent infinite loop
        } while (usedNames.has(name));
        
        usedNames.add(name);
        return name;
    },
    
    generateSection: function(maleCount, femaleCount) {
        const students = [];
        const usedNames = new Set();
        
        // Generate male students
        for (let i = 0; i < maleCount; i++) {
            students.push({
                gender: 'M',
                name: this.generateName('M', usedNames)
            });
        }
        
        // Generate female students
        for (let i = 0; i < femaleCount; i++) {
            students.push({
                gender: 'F',
                name: this.generateName('F', usedNames)
            });
        }
        
        // Sort: males first (alphabetically), then females (alphabetically)
        students.sort((a, b) => {
            if (a.gender !== b.gender) {
                return a.gender === 'M' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
        
        return students;
    }
};