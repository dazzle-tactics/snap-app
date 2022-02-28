import React from 'react';

const ListItem = ({highScore, deleteHighScore, index}) => {


    return (
        <div className='individual-player'>
            <p>{index + 1}:  {highScore.name} {highScore.score}</p>
            <button onClick={()=>deleteHighScore(highScore._id)}>Remove Player from Scoreboard becuase they are a filthy cheat</button>
        </div>
    )
}

export default ListItem;