<?php

	$db = new PDO("sqlite:db.dat");
	$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	function getTasks() {
		global $db;
		$stmt = $db->query("SELECT * FROM tasks ORDER BY add_time");
		$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
		foreach($result as $task) {
			$ret[] = parseTask($task);
		}
		return $ret;
	}

	function addTaskaddTask($title, $description) {
		global $db;
		$stmt = $db->prepare("INSERT INTO tasks (add_time, title, description) VALUES (:time, :title, :desc)");
		$stmt->bindValue(":time", time());
		$stmt->bindValue(":title", $title);
		$stmt->bindValue(":desc", $description);
		return $stmt->execute();
	}

	function updateTask($id, $title, $description, $completed = false) {
		global $db;
		$stmt = $db->prepare("UPDATE tasks SET update_time = :time, title = :title, description = :desc, completed = :completed WHERE id = :id");
		$stmt->bindValue(":id", $id);
		$stmt->bindValue(":time", time());
		$stmt->bindValue(":title", $title);
		$stmt->bindValue(":desc", $description);
		$stmt->bindValue(":completed", $completed ? "1" : "0");
		return $stmt->execute();
	}

	function loadTask($id) {
		global $db;
		$stmt = $db->prepare("SELECT * FROM tasks WHERE id = :id");
		$stmt->bindValue(":id", $id);
		$stmt->execute();
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	function deleteTask($id) {
		global $db;
		$stmt = $db->prepare("DELETE FROM tasks WHERE id = :id");
		$stmt->bindValue(":id", $id);
		return $stmt->execute();
	}

	function setTaskComplete($id) {
		global $db;
		$stmt = $db->prepare("UPDATE tasks SET completed = 1 WHERE id = :id");
		$stmt->bindValue(":id", $id);
		return $stmt->execute();
	}

	function setTaskIncomplete($id) {
		global $db;
		$stmt = $db->prepare("UPDATE tasks SET completed = 0 WHERE id = :id");
		$stmt->bindValue(":id", $id);
		return $stmt->execute();
	}

	function parseTask(array $task) {
		$task["completed"] = $task["completed"] == "1";
		return $task;
	}

	$response = array("success" => false);

	try {
		if(!empty($_REQUEST["title"]) && isset($_REQUEST["description"]) && empty($_REQUEST["update_id"])) {
			//vlozeni noveho ukolu
			if(addTask((string)$_REQUEST["title"], (string)$_REQUEST["description"])) {
				$response["task"] = parseTask(loadTask($db->lastInsertId()));
				$response["success"] = true;
			}
		} elseif(!empty($_REQUEST["title"]) && isset($_REQUEST["description"]) && !empty($_REQUEST["update_id"]) && isset($_REQUEST["completed"])) {
			//aktualizace
			if(updateTask($_REQUEST["update_id"], (string)$_REQUEST["title"], (string)$_REQUEST["description"], $_REQUEST["completed"] == 1)) {
				$response["task"] = parseTask(loadTask($_REQUEST["update_id"]));
				$response["success"] = true;
			}
		} elseif(!empty($_REQUEST["delete_id"])) {
			//smazani
			deleteTask(intval($_REQUEST["delete_id"]));
			$response["success"] = true;
		} elseif(!empty($_REQUEST["complete_id"])) {
			//hotovo
			setTaskComplete(intval($_REQUEST["complete_id"]));
			$response["success"] = true;
		} elseif(!empty($_REQUEST["incomplete_id"])) {
			//nehotovo
			setTaskIncomplete(intval($_REQUEST["incomplete_id"]));
			$response["success"] = true;
		} else {
			//nacteni vseho
			$response["tasks"] = getTasks();
			$response["success"] = true;
		}
	} catch (Exception $e) {
		$response["error"] = $e->getMessage();
	}

	header("Content-Type: application/json");
	echo json_encode($response);