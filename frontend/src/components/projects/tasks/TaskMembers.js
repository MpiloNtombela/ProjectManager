import React, {memo} from 'react';
import PropTypes from 'prop-types'
import {useDispatch} from "react-redux";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import {addRemoveMember} from "../../../actions/projects/tasks";


const TaskMembers = ({id, members, isRequesting}) => {
  const dispatch = useDispatch()
  const handleRemoveMember = userId => {
    console.log(userId)
    dispatch(addRemoveMember(id, userId, 'remove'))
  }
  return (
    <>
      {members && <>
        {members.map(user => (
          <Chip key={user.id}
                avatar={<Avatar
                  src={user.avatar}
                  alt={user.username}/>}
                label={user.username}
                onDelete={() => {
                  handleRemoveMember(user.id)
                }}
                disabled={isRequesting}
                variant="outlined"/>
        ))}</>}
    </>
  );
};

TaskMembers.propTypes = {
  id: PropTypes.string.isRequired,
  members: PropTypes.array.isRequired,
  isRequesting: PropTypes.bool,
};

export default memo(TaskMembers);