export default class {
    constructor(models) {
        this.models = models
    }

    get markers() {
        return this.models.map(agent => {
            return agent.marker
        })
    }

    get names() {
        return this.models.map(agent => {
            return agent.name
        })
    }

    findByName(name) {
        var result = $.grep(this.models, (e)=> { return e.name == name});
        return result[0];
    }

    filterByAge(age = [0, 150]) {
        return $.grep(this.models, (e)=> {
            return (e.age > age[0] && e.age < age[1])
        });
    }

    filterByGender(gender) {
        return $.grep(this.models, (e)=> { return (e.gender == gender) });
    }

    filterByAgeAndGender(age = [0, 150], gender = "Both") {
        var matches;
        if(gender == "Both")
            matches = this.filterByAge(age);
        else {
            matches = $.grep(this.models, (e)=> {
                return (e.age > age[0] &&
                e.age < age[1] &&
                e.gender == gender)
            });
        }
        return matches
    }
}