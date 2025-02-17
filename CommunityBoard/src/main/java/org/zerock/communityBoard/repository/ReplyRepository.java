package org.zerock.communityBoard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.communityBoard.domain.Reply;

public interface ReplyRepository extends JpaRepository<Reply, Long> {

}
