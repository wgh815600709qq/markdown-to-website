
    import React, { Component } from 'react'
    import { Link } from 'react-router-dom';
    export default class index extends Component {
        constructor() {
            super()
        }

        render() {
            return <div className='brumb'>
                <div className="title">导航</div>
                
                <div className="menu">about
                    <div className="son">
                        <div className="item"><Link to='/about/index'>index</Link></div>
                    </div>
                </div>

                <div className="menu">main
                    <div className="son">
                        <div className="item"><Link to='/main/index'>index</Link></div>
<div className="item"><Link to='/main/test'>test</Link></div>
                    </div>
                </div>

                <div className="menu">mine
                    <div className="son">
                        <div className="item"><Link to='/mine/index'>index</Link></div>

                <div className="menu">memory
                    <div className="son">
                        <div className="item"><Link to='/mine/memory/after18'>after18</Link></div>
<div className="item"><Link to='/mine/memory/before18'>before18</Link></div>
                    </div>
                </div>
                    </div>
                </div>
            </div>
        }
    }