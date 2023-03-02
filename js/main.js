let eventBus = new Vue()

Vue.component('column', {
    // колонки
    template: `
 <section id="main" class="main-alt">
 
        <div class="columns">
            <newCard></newCard>
          <p class="error" v-for="error in errors">{{ error }}</p>
                <column_1 :column_1="column_1"></column_1>
                <column_2 :column_2="column_2"></column_2>
                <column_3 :column_3="column_3"></column_3>
            </div>
 </section>
    `,
    data() {
        return {
            column_1: [],
            column_2: [],
            column_3: [],
            errors: [],
        }
    },
    mounted() {
        // создание заметки
        eventBus.$on('addColumn_1', ColumnCard => {

            if (this.column_1.length < 3) {
                this.errors.length = 0
                this.column_1.push(ColumnCard)
            } else {
                this.errors.length = 0
                this.errors.push('макс коллво заметок в 1 столбце')
            }
                })

        eventBus.$on('addColumn_2', ColumnCard => {
            if (this.column_2.length < 5) {
                this.errors.length = 0
                this.column_2.push(ColumnCard)
                this.column_1.splice(this.column_1.indexOf(ColumnCard), 1)
            } else {
                this.errors.length = 0
                this.errors.push('Вы не можете редактировать первую колонку, пока во второй есть 5 карточек.')
            }
        })
        eventBus.$on('addColumn_3', ColumnCard => {
    //         this.column_3.push(ColumnCard)
    //         this.column_2.splice(this.column_2.indexOf(ColumnCard), 1)
    //     })
    //     eventBus.$on('addColumn1-3', ColumnCard => {
    //         this.column_3.push(ColumnCard)
    //         this.column_1.splice(this.column_1.indexOf(ColumnCard), 1)
    //     })
    // }
            if (this.column_2.length === 5) {
                this.errors.length = 0
                this.column_3.push(ColumnCard)
                this.column_2.splice(this.column_2.indexOf(ColumnCard), 1)
            } else {
                this.errors.length = 0
                this.errors.push('Превышено число заметок в столбце')
            }
        })
    }
})

Vue.component('newCard', {
        template: `
    <section id="main" class="main-alt">
    
        <form class="row" @submit.prevent="Submit">
        
            <p class="main__text">Заметки</p>
            <p class="error" v-for="error in errors">{{ error }}</p>
        <div class="form__control">
                
            <div class="form__name">
                <input required type="text" id="name" style="color: #E55A3C" placeholder="Введите название заметки"/>
            </div>
            
            <input required type="text" style="color: #E55A3C" v-model="point_1" placeholder="Первый пункт"/>

            <input required type="text" style="color: #E55A3C" v-model="point_2" placeholder="Второй пункт"/>

            <input required type="text" style="color: #E55A3C" v-model="point_3" placeholder="Третий пункт"/> 
            <br>
            <input type="text" style="color: #E55A3C" v-model="point_4"  placeholder="Четвертый пункт" v-show ="note4">
            <br>
             <input type="text" style="color: #E55A3C" v-model="point_5"  placeholder="Пятый пункт" v-show="note5">

        </div>
       <div class="plus_minus_p">
            <p style="color:#E55A3C">Добавить/удалить поле для заметки</p>
            </div>
            <div class="minus_plus">
                 
                   <p class="plus">
                        <button type='button' @click="addField"> + </button>
                   </p>
                   
                   <p class="minus">
                        <button type='button' @click="removeField"> - </button>
                   </p>
            </div>
            
            <div>                    
                <p class="sub">
                        <input type="submit" value="Отправить"> 
                </p>
            </div>
            <div class="form__control">
            </div>
        </form>
    </section>
    `,
        data() {
            return {
                note4: false,
                note5: false,
                name: null,
                point_1: null,
                point_2: null,
                point_3: null,
                point_4: null,
                point_5: null,
                date: null,
            }
        },
        methods: {
            addField() {
                if (this.note4 === false) {
                    console.log('1')
                    return this.note4 = true
                } else {
                    console.log('2')
                    return this.note5 = true
                }

            },
            removeField() {

                if (this.note5 === true) {
                    return this.note5 = false
                }

                if (this.note4 === true) {
                    return this.note4 = false
                }


            },

            Submit() {
                    let card = {
                        name: this.name,
                        points: [
                            {name: this.point_1, completed: false},
                            {name: this.point_2, completed: false},
                            {name: this.point_3, completed: false},
                            {name: this.point_4, completed: false},
                            {name: this.point_5, completed: false}
                        ],
                        date: null,
                        // date: null,
                        status: 0,
                        errors: [],
                    }
                    eventBus.$emit('addColumn_1', card)
                    this.name = null;
                    this.point_1 = null
                    this.point_2 = null
                    this.point_3 = null
                    this.point_4 = null
                    this.point_5 = null
                }
            }

})



Vue.component('column_1', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__one">
                <div class="card" v-for="card in column_1">
                <h3>>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="changeCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_1: {
            type: Array,
        },
        column_2: {
            type: Array,
        },
        card: {
            type: Object,
        },
        errors: {
            type: Array,
        }
    },
    methods: {
        changeCompleted(ColumnCard, task) {
            task.completed = true
            ColumnCard.status += 1
            let count = 0
            for(let i = 0; i < 5; i++) {
                if (ColumnCard.points[i].title != null) {
                    count++
                }
            }
            console.log(ColumnCard.status)
            console.log(count)
            if ((ColumnCard.status / count) * 100 >= 50) {
                eventBus.$emit('addColumn_2', ColumnCard)
            }
            if ((ColumnCard.status / count) * 100 === 100) {
                ColumnCard.date = new Date().toLocaleString()
                eventBus.$emit('addColumn1-3', ColumnCard)
            }

        },
    },
})

Vue.component('column_2', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__two">
                <div class="card" v-for="card in column_2">
                <h3>{{ card.name }}</h3>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="changeCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                </div>
            </div>
        </section>
    `,
    props: {
        column_2: {
            type: Array,
        },

        card: {
            type: Object,
        },
    },
    methods: {
        changeCompleted(card, task) {
                eventBus.$emit('addColumn_3', card)
            }
        }

})

Vue.component('column_3', {
    template: `
        <section id="main" class="main-alt">
            <div class="column column__three">
                <div class="card" v-for="card in column_3"><p>{{ card.name }}</p>
                    <div class="tasks" v-for="task in card.points"
                        v-if="task.name != null"
                        @click="changeCompleted(card, task)"
                        :class="{completed: task.completed}">
                        {{ task.name }}
                    </div>
                        <p>{{ card.date }}</p>
                </div>
            </div>
        </section>
    `,
    props: {
        column_3: {
            type: Array,
        },
        card: {
            type: Object,
        },
    },
})



let app = new Vue({
    el: '#app',
})