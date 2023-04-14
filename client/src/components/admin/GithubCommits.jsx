import React, { useState, useEffect } from "react";
import { ListGroup } from "react-bootstrap";

function GithubCommits() {
  const [commits, setCommits] = useState([]);

  useEffect(() => {
    const fetchCommits = async () => {
      const response = await fetch(
        "https://api.github.com/repos/AlfredBrandon1/KinderLink/commits"
      );
      const data = await response.json();
      setCommits(data.slice(0, 5)); // Display the latest 5 commits
    };
    fetchCommits();
  }, []);

  const getTimeAgo = (commitDate) => {
    const diffInMs = Date.now() - Date.parse(commitDate);
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    if (diffInMs < minute) {
      return `${Math.floor(diffInMs / 1000)} seconds ago`;
    } else if (diffInMs < hour) {
      return `${Math.floor(diffInMs / minute)} minutes ago`;
    } else if (diffInMs < day) {
      return `${Math.floor(diffInMs / hour)} hours ago`;
    } else if (diffInMs < 7 * day) {
      return `${Math.floor(diffInMs / day)} days ago`;
    } else {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(commitDate).toLocaleDateString('en-US', options);
    }
  }

  return (
    <div>
      <h2>Github Latest Commits</h2>
      <ListGroup>
        {commits.map((commit, index) => (
          <ListGroup.Item key={commit.sha}>
            <div>{index +1 }. &nbsp; 
               {commit.commit.message} 
              <small className="text-muted">
                {" "}
                - {commit.commit.author.name} ({commit.commit.author.email}) 
                {" "}
                <span className="commit-date">{getTimeAgo(commit.commit.author.date)}</span>
              </small>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}



export default GithubCommits;

